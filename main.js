'use strict';
const utils = require('@iobroker/adapter-core');
const fs = require('fs');
const net = require('net');
const m = require('./lib/mercury.js');
const SerialPort = require('serialport');
const InterByteTimeout = require('@serialport/parser-inter-byte-timeout');
let mercury, serial;
let adapter, _callback, devices = [], dataFile = 'devices.json', pollAllowed = false, isOnline = false, iter = 0, firstStart = true,
    fastPollingTime, slowPollingTime, timeout = null, reconnectTimeOut = null, CRCTimeOut = null, timeoutPoll = null, isPoll = false, queueCmd = null, endTime, startTime;
let parser;

const msg = {cmd: [], protocol: null, addr: 0, pwd: [], user: 1};

function startAdapter(options){
    return adapter = utils.adapter(Object.assign({}, options, {
        systemConfig: true,
        name:         'mercury',
        ready:        main,
        unload:       (callback) => {
            timeout && clearTimeout(timeout);
            timeoutPoll && clearTimeout(timeoutPoll);
            CRCTimeOut && clearTimeout(CRCTimeOut);
            reconnectTimeOut && clearTimeout(reconnectTimeOut);
            if(parser) parser.destroy();
            if (serial) serial.close;
            if (mercury) mercury.destroy();
            try {
                adapter.log.debug('cleaned everything up...');
                callback();
            } catch (e) {
                callback();
            }
        },
        stateChange:  (id, state) => {
            if (id && state && !state.ack){
                adapter.log.debug(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
                const arr = id.split('.');
                const sn = parseInt(arr[2]);
                id = arr[arr.length - 1];
                if (id === 'RAW'){
                    const index = getDeviceIndexAtSn(sn);
                    let addr = devices[index].conf.addr.val;
                    if (devices[index].conf.protocol.val === 1) addr = addrToArray(devices[index].conf.addr.val);
                    const val = state.val.split(' ').map((x) => {
                        return parseInt(x, 16);
                    });
                    const cmd = {
                        cmd: [].concat(addr, val),
                        cb:  (response) => {
                            adapter.log.debug('Ответ получен - ' + JSON.stringify(response));
                            adapter.setState(sn + '.RAW', {val: JSON.stringify(response), ack: true});
                        }
                    };
                    if (isPoll){
                        adapter.log.debug('RAW - Идет опрос счетчика, добавляем команду в очередь');
                        queueCmd = cmd;
                    } else {
                        sendQueue(cmd);
                    }
                }
            }
        },
        message:      obj => {
            if (typeof obj === 'object' && obj.command){
                adapter.log.debug(`message ******* ${JSON.stringify(obj)}`);
                if (obj.command === 'getDevices'){
                    obj.callback && adapter.sendTo(obj.from, obj.command, devices, obj.callback);
                }
                if (obj.command === 'getOptions'){
                    obj.callback && adapter.sendTo(obj.from, obj.command, m.options, obj.callback);
                }
                if (obj.command === 'findDevice'){
                    if (isOnline){
                        _callback = (e) => {
                            if (e) adapter.log.error('findDevice ERROR ---' + JSON.stringify(e));
                            pollAllowed = true;
                            obj.callback && adapter.sendTo(obj.from, obj.command, e ? {error: e} :devices, obj.callback);
                        };
                        findDevice(obj.message);
                    } else {
                        obj.callback && adapter.sendTo(obj.from, obj.command, {error: 'No connection to the device'}, obj.callback);
                    }
                }
                if (obj.command === 'updateDevices'){
                    if (obj.message.conf.pwd && obj.message.conf.pwd.val !== null){
                        obj.message.conf.pwd.val = obj.message.conf.pwd.val.toString().split('');
                    }
                    adapter.log.debug('updateDevices');
                    devices[obj.message.index].conf = obj.message.conf;
                    devices[obj.message.index].conf.model.name = m.options.model[obj.message.conf.model.val].desc;
                    saveDevices();
                    obj.callback && adapter.sendTo(obj.from, obj.command, devices, obj.callback);
                }
                if (obj.command === 'deleteDevice'){
                    pollAllowed = false;
                    devices.splice(obj.message.index, 1);
                    saveDevices();
                    pollAllowed = true;
                    obj.callback && adapter.sendTo(obj.from, obj.command, devices, obj.callback);
                }
                if (obj.command === 'getSerialPorts'){
                    listSerial().then((ports) => {
                        adapter.log.debug('List of ports: ' + JSON.stringify(ports));
                        obj.callback && adapter.sendTo(obj.from, obj.command, ports, obj.callback);
                    });
                }
            } else {
                adapter.log.debug(`message x ${obj.command}`);
            }
        }
    }));
}

function poll(){
    timeoutPoll && clearTimeout(timeoutPoll);
    if (pollAllowed){
        iter = 0;
        isPoll = true;
        let nameArray = '';
        for (let index = 0; index < devices.length; index++) {
            msg.protocol = devices[index].conf.protocol.val;
            adapter.log.debug('Опрашиваем счетчик # ' + index + ' с адресом: ' + devices[index].conf.addr.val);
            openChannel(index, msg, (e) => {
                if (!e){
                    if (endTime - startTime > slowPollingTime){
                        startTime = new Date().getTime();
                        nameArray = 'poll';
                    } else {
                        if (firstStart){
                            pollAllowed = false;
                            nameArray = 'first';
                        } else {
                            nameArray = 'fastpoll';
                        }
                    }
                    adapter.log.debug('slowPollingTime = ' + (endTime - startTime));
                    sendPolling(index, msg.protocol, nameArray);
                } else {
                    adapter.log.error(e);
                }
            });
        }
    }
}

function sendPolling(index, protocol, nameArray, cb){
    try {
        if (devices.length > 0){
            let addr = devices[index].conf.addr.val;
            if (protocol === 1) addr = addrToArray(devices[index].conf.addr.val);
            msg.cmd = [].concat(addr, m.options.protocol[protocol][nameArray][iter].code, m.options.protocol[protocol][nameArray][iter].cmd);
            adapter.log.debug('-----------------------------------------------------------------------------------------------------');
            adapter.log.debug('Получаем информацию из массива (' + nameArray + ') - ' + m.options.protocol[protocol][nameArray][iter].desc + '. cmd = ' + JSON.stringify(msg.cmd) + ' / iter=' + iter);
            send(msg, (response) => {
                adapter.log.debug(response.length > 0 ? 'Ответ получен, парсим:' :'Нет ответа на команду, читаем следующую.');
                if (response.length > 0) devices = m.options.protocol[protocol][nameArray][iter].func(devices, index, msg.cmd, response);
                iter++;
                if (iter > m.options.protocol[protocol][nameArray].length - 1){
                    iter = 0;
                    if (nameArray === 'first') firstStart = false;
                    if (queueCmd){
                        sendQueue(queueCmd);
                    }
                    pollAllowed = true;
                    adapter.log.debug('# Все данные прочитали, сохраняем полученные данные. #'/* + JSON.stringify(devices)*/);
                    isPoll = false;
                    setObjects(index);
                    timeoutPoll = setTimeout(() => {
                        endTime = new Date().getTime();
                        poll();
                    }, fastPollingTime);
                } else {
                    sendPolling(index, protocol, nameArray, cb);
                }
            });
        }
    } catch (e) {
        adapter.log.error('Error: sendPolling ' + e);
    }
}

function sendQueue(cmd){
    send(cmd, (response) => {
        queueCmd = null;
        cmd.cb && cmd.cb(response);
    });
}

function findDevice(_msg){
    adapter.log.debug('findDevice msg ---' + JSON.stringify(_msg)); //{"addr":"","model":"230"}
    pollAllowed = false;
    msg.cmd = [];
    msg.addr = _msg.addr.toString();
    msg.user = parseInt(_msg.user, 10);
    msg.model = parseInt(_msg.model, 10);
    msg.protocol = m.options.model[_msg.model].type;
    msg.modelname = m.options.model[_msg.model].desc;
    msg.pwd = (_msg.pwd.toString().split('')).map((x) => {
        return parseInt(x, 10);
    });
    if (msg.model && !msg.addr && msg.protocol === 2){
        adapter.log.debug('Поиск трехфазного с адресом - 0');
        openChannel(null, msg, (e) => {
            if (!e){
                msg.cmd = [0x00, 0x08, 0x05]; //Запрос с нулевым адресом 3 фазного счетчика
                send(msg);
            } else {
                _callback('Error opening communication channel');
            }
        });
    } else if (msg.model && msg.addr){
        if (msg.protocol === 1){
            if (parseInt(msg.model, 10) === 200){
                msg.addr = msg.addr.slice(msg.addr.length - 6, msg.addr.length);
            } else {
                msg.addr = msg.addr.slice(msg.addr.length - 8, msg.addr.length);
            }
            msg.cmd = msg.cmd.concat(addrToArray(msg.addr), [0x2f]);
            adapter.log.debug('----------------------------------------------------------------------------');
            adapter.log.debug('Поиск однофазного с адресом - ' + msg.addr);
            send(msg);
        }
        if (msg.protocol === 2){
            if (msg.addr.length > 2){
                msg.addr = parseInt(msg.addr.substr(msg.addr.length - 3));
                if (parseInt(msg.addr, 10) > 240){
                    msg.addr = parseInt(msg.addr.toString().substr(msg.addr.toString().length - 2));
                }
            }
            msg.addr = parseInt(msg.addr, 10);
            adapter.log.debug('Поиск треxфазного с адресом - ' + msg.addr);
            openChannel(null, msg, (e) => {
                if (!e){
                    msg.cmd = [msg.addr, 0x08, 0x05]; //Запрос 3 фазного
                    send(msg);
                } else {
                    _callback('Error opening communication channel');
                }
            });
        }
    } else {
        _callback('Invalid data specified');
    }
}

function parseFindPacket(response, msg, cb){ //response, cmd, protocol
    if (msg.protocol === 1){
        adapter.log.debug('Парсим ответ от однофазного счетчика');
        if (/*response[0] === 0 && */response[4] === 47){  //hex 2f //Ответ на поиск 1 фазного
            const addrInt = response.readUInt32BE(0); //0 14 31 155
            const index = getDeviceIndexAtAddr(addrInt);
            devices[index] = m.template[msg.protocol];
            devices[index].conf.addr.val = addrInt;
            devices[index].conf.user.val = 2;
            devices[index] = m.template[msg.protocol];
            devices[index].conf.protocol.val = msg.protocol;
            devices[index].conf.model.name = msg.modelname;
            devices[index].conf.model.val = msg.model;
            iter = 0;
            getDeviceInfo(index, msg);
        } else {
            adapter.log.debug('cb && cb(response)');
            cb && cb(response);
        }
    } else if (msg.protocol === 2){
        adapter.log.debug('Парсим ответ от трехфазного счетчика');
        if ((response[0] === 0 || response[0] === msg.addr) && response[1] === 0){ //Ответ на поиск 3 фазного
            adapter.log.debug('Парсим адрес трехфазного счетчика');
            const index = getDeviceIndexAtAddr(response[2]);
            devices[index] = m.template[msg.protocol];
            devices[index].conf.addr.val = response[2];
            devices[index].conf.protocol.val = msg.protocol;
            devices[index].conf.model.name = msg.modelname;
            devices[index].conf.model.val = msg.model;
            if (msg.pwd && msg.user){
                devices[index].conf.pwd.val = msg.pwd;
                devices[index].conf.user.val = msg.user;
                msg.pwd = null;
                msg.user = 1;
            }
            iter = 0;
            getDeviceInfo(index, msg);
        } else if (response[0] === 0 && response[1] !== 0){
            adapter.log.debug('Ошибка запроса - ' + m.options.respcode[response[1]]);
            _callback(m.options.respcode[response[1]]);
        } else {
            adapter.log.debug('cb && cb(response)');
            cb && cb(response);
        }
    }
}

function getDeviceInfo(index, msg, cb){
    adapter.log.debug('-----------------------------------------------------------------------------------------------------');
    msg.cmd = [];
    let addr = [devices[index].conf.addr.val];
    if (msg.protocol === 1){
        const _addr = Buffer.allocUnsafe(4);
        _addr.writeUInt32BE(addr, 0);
        addr = (Array.prototype.slice.call(_addr, 0));
    }
    msg.cmd = msg.cmd.concat(addr, m.options.protocol[msg.protocol].readinfo[iter].code, m.options.protocol[msg.protocol].readinfo[iter].cmd);
    adapter.log.debug('Получаем информацию  из массива (readinfo) - ' + m.options.protocol[msg.protocol].readinfo[iter].desc + '. cmd = ' + JSON.stringify(msg.cmd) + ' / iter=' + iter);
    send(msg, (response) => {
        adapter.log.debug('Ответ получен, парсим пакет:');
        devices = m.options.protocol[msg.protocol].readinfo[iter].func(devices, index, msg, response);
        iter++;
        if (iter > m.options.protocol[msg.protocol].readinfo.length - 1){
            iter = 0;
            saveDevices();
            _callback();
        } else {
            getDeviceInfo(index, msg, cb);
        }
    });
}

function send(msg, cb){
    if (mercury) mercury._events.data = undefined;
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
        adapter.log.error('No response');
        if (mercury) mercury._events.data = undefined;
        pollAllowed = true;
        _callback && _callback('No response');
        cb && cb('');
    }, 5000);
    if (serial){
        adapter.log.debug('send serial ' + serial.path);
        parser.once('data', (response) => {
            timeout && clearTimeout(timeout);
            checkCRC(response, msg, cb);
            cb = null;
        });
    } else {
        adapter.log.debug('send tcp');
        mercury.once('data', (response) => {
            timeout && clearTimeout(timeout);
            checkCRC(response, msg, cb);
            cb = null;
        });
    }
    const b1 = ((m.crc(msg.cmd) >> 8) & 0xff);
    msg.cmd[msg.cmd.length] = (m.crc(msg.cmd) & 0xff);
    msg.cmd[msg.cmd.length] = b1;
    const buf = Buffer.from(msg.cmd);
    adapter.log.debug('Send cmd - [' + m.toHexString(msg.cmd) + ']');
    serial ? serial.write(buf) :mercury.write(buf);
}

function main(){
    if (!adapter.systemConfig) return;
    adapter.subscribeStates('*');
    fastPollingTime = adapter.config.fastpollingtime ? adapter.config.fastpollingtime :5000;
    slowPollingTime = adapter.config.slowpollingtime ? adapter.config.slowpollingtime :60000;
    startTime = new Date().getTime();
    endTime = new Date().getTime();
    m.on('debug', (txt) => {
        adapter.log.debug('* ' + txt);
    });
    m.on('info', (txt) => {
        adapter.log.info('* ' + txt);
    });
    const dir = utils.controllerDir + '/' + adapter.systemConfig.dataDir + adapter.namespace.replace('.', '_') + '/';
    dataFile = dir + dataFile;
    adapter.log.debug('adapter.config = ' + JSON.stringify(adapter.config));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.readFile(dataFile, (err, data) => {
        if (!err){
            try {
                devices = JSON.parse(data);
                connect();
            } catch (err) {
                fs.writeFile(dataFile, '', (err) => {
                    if (err) adapter.log.error('writeFile ERROR = ' + JSON.stringify(err));
                    connect();
                });
            }
        } else {
            fs.writeFile(dataFile, '', (err) => {
                if (err) adapter.log.error('writeFile ERROR = ' + JSON.stringify(err));
                connect();
            });
        }
    });
}

function connect(){
    if (adapter.config.typeconnect === 'tcp' && adapter.config.ip && adapter.config.tcpport){
        connectTCP();
    } else if (adapter.config.typeconnect === 'usb' && adapter.config.usbport){
        serial = new SerialPort(adapter.config.usbport, {
            baudRate:   parseInt(adapter.config.baud, 10),
            parity:     adapter.config.parity ? 'even' :'none', //'none', 'even', 'mark', 'odd', 'space'.
            dataBits:   8,
            endOnClose: false,
            autoOpen:   false
        });
        const interval = parseInt(adapter.config.timeoutresponse, 10) || 500;
        parser = serial.pipe(new InterByteTimeout({maxBufferSize: 512, interval: interval})); //
        serial.setMaxListeners(10);
        parser.setMaxListeners(10);
        connectSerial();
    }
}

function openSerialPort(){
    serial.open((err) => {
        if (err){
            adapter.log.error('serial open ' + adapter.config.usbport + ' ERROR: ' + err.message);
            reconnect();
        }
    });
}

function connectSerial(){
    try {
        serial.on('open', () => {
            adapter.log.info('Connected to port ' + adapter.config.usbport);
            adapter.setState('info.connection', true, true);
            pollAllowed = true;
            isOnline = true;
            if (devices && devices.length > 0) poll();
        });
        serial.on('readable', () => {
            adapter.log.debug('readable Data:', serial.read());
        });
        serial.on('error', (err) => {
            //if(!serial.isOpen){
            adapter.log.error('Serial ' + adapter.config.usbport + ' ERROR: ' + err.message);
            //}
            //reconnect();
        });
        serial.on('close', (err) => {
            if (err){
                adapter.log.debug('serial closed: ' + err.message);
            }
            reconnect();
        });
    } catch (e) {
        adapter.log.error('SerialPort ERROR = ' + JSON.stringify(e));
    }
    openSerialPort();
}

function connectTCP(){
    adapter.log.debug('Connect to ' + adapter.config.ip + ':' + adapter.config.tcpport);
    mercury = new net.Socket();
    mercury.connect({host: adapter.config.ip, port: adapter.config.tcpport}, () => {
        adapter.log.info('Connected to server ' + adapter.config.ip + ':' + adapter.config.tcpport);
        adapter.setState('info.connection', true, true);
        pollAllowed = true;
        isOnline = true;
        if (devices && devices.length > 0) poll();
    });
    mercury.on('close', (e) => {
        adapter.log.debug('closed ' + JSON.stringify(e));
        //reconnect();
    });
    mercury.on('error', (e) => {
        adapter.log.error('Mercury ERROR: ' + JSON.stringify(e));
        /*if (!e.code || e.code === 'EISCONN' || e.code === 'EPIPE' || e.code === 'EALREADY' || e.code === 'EINVAL' || e.code === 'ECONNRESET' || e.code === 'ENOTFOUND' || e.code === 'ECONNREFUSED')*/
        reconnect();
    });
    mercury.on('end', () => {
        adapter.log.debug('Disconnected from server');
        reconnect();
        _callback && _callback('Disconnected from server');
    });
}

function reconnect(){
    pollAllowed = false;
    isOnline = false;
    adapter.setState('info.connection', false, true);
    adapter.log.debug('Mercury reconnect after 10 seconds');
    reconnectTimeOut = setTimeout(() => {
        if (mercury) mercury._events.data = undefined;
        if (serial) serial._events.data = undefined;
        serial && serial.close();
        serial ? openSerialPort() :connectTCP();
    }, 10000);
}

function openChannel(index, msg, cb){
    msg.protocol = index ? devices[index].conf.protocol.val :msg.protocol;
    if (msg.protocol === 2){
        msg.addr = index ? devices[index].conf.addr.val :msg.addr;
        if (index !== null){
            msg.pwd = devices[index].conf.pwd.val;
            msg.user = parseInt(devices[index].conf.user.val, 10);
        }
        msg.cmd = [msg.addr, 0x01, msg.user].concat(msg.pwd);
        adapter.log.debug('Открываем канал связи msg = ' + JSON.stringify(msg));
        send(msg, (response) => {
            if (response.length === 4 && response[1] === 0){
                adapter.log.debug('Канал связи открыт');
                cb();
            } else {
                //adapter.log.error('Error: opening communication channel');
                if (mercury || serial){
                    reconnect();
                } else {
                    cb && cb('Error: opening communication channel');
                }
            }
        });
    } else {
        cb && cb();
    }
}

const checkCRC = function (response, msg, cb){
    adapter.log.debug('RESPONSE = ' + JSON.stringify(response));
    const crc_packet = (response.slice(response.length - 2, response.length)).toJSON().data.toString();
    const crc_calc = [(m.crc(response.slice(0, response.length - 2)) & 0xff), ((m.crc(response.slice(0, response.length - 2)) >> 8) & 0xff)].toString();
    if (crc_packet === crc_calc){
        adapter.log.debug('CRC check packet successfully - CRC packet(' + JSON.stringify(crc_packet) + ') = CRC calc(' + JSON.stringify(crc_calc) + ')');
        if (cb){
            CRCTimeOut = setTimeout(() => {
                cb(response);
            }, 100);
        } else {
            parseFindPacket(response, msg, cb);
        }
    } else {
        adapter.log.debug('check CRC error - CRC packet(' + JSON.stringify(crc_packet) + ') != CRC calc(' + JSON.stringify(crc_calc) + ')');
        pollAllowed = true;
        _callback && _callback('CRC Error');
        cb && cb('');
    }
};

const getDeviceIndexAtAddr = function (addr){
    let index = null;
    devices.some((item, i) => {
        if (devices[i].conf.addr.val === addr) index = i;
    });
    if (index !== null){
        return index;
    } else {
        return devices.length;
    }
};

const getDeviceIndexAtSn = function (s){
    let index = null;
    devices.some((item, i) => {
        if (devices[i].info.sn.val === s) index = i;
    });
    if (index !== null){
        return index;
    } else {
        return devices.length;
    }
};

function saveDevices(){
    adapter.log.debug('Сохраняем в файл');
    const data = JSON.stringify(devices, null, 2);
    fs.writeFile(dataFile, data, (err) => {
        if (err) adapter.log.error('writeFile Error - ' + err);
        adapter.log.debug('Данные сохранены в файл успешно.');
    });
}

function listSerial(){
    return SerialPort.list()
        .then(ports =>
            ports.map(port => {
                return {path: port.path};
            })
        ).catch(err => {
            adapter.log.error(err);
            return {path: 'Not available'};
        });
}

const addrToArray = function (addrInt){
    const _addr = Buffer.allocUnsafe(4);
    _addr.writeUInt32BE(parseInt(addrInt, 10), 0);
    return Array.prototype.slice.call(_addr, 0);
};

function setStates(index, name, desc, val, unit){
    if (((val > -5 && val < 0) || val === null) && !~name.indexOf('cosfTotal')) {
        val = 0;
    }
    adapter.getObject(name, function (err, obj){
        //adapter.log.debug('getState / err = ' + err + ' / name = ' + name + ' / state = ' + JSON.stringify(state));
        if (err || !obj){
            const role = 'state';
            const _unit = unit ? unit :'';
            let type = 'number';
            if (~name.indexOf('RAW')) type = 'string';
            adapter.log.debug('setObject = ' + name + ' { val = ' + val + '}');
            adapter.setObject(name, {
                type:   'state',
                common: {
                    name: desc,
                    desc: desc,
                    type: type,
                    unit: _unit,
                    role: role
                },
                native: {}
            });
            adapter.setState(name, {val: val, ack: true});
        } else {
            if (obj.common.desc !== desc || obj.common.unit !== unit){
                adapter.extendObject(name, {common: {name: desc, desc: desc, unit: unit}});
            }
            adapter.getState(name, function (err, state){
                if(state){
                    if (state.val === val){
                        adapter.log.debug('setState ' + name + ' { oldVal: ' + state.val + ' = newVal: ' + val + ' }');
                    } else if (state.val !== val){
                        adapter.setState(name, {val: val, ack: true});
                        adapter.log.debug('setState ' + name + ' { oldVal: ' + state.val + ' != newVal: ' + val + ' }');
                    }
                }
            });
        }
    });
}

function setDev(index){
    adapter.log.debug('------------ setDev -------------');
    const prefix = devices[index].info.sn.val.toString();
    let img = parseInt(devices[index].conf.model.val);
    if (img === 230 || img === 231 || img === 234) img = img + '' + devices[index].info.typeCount.val;
    const icon = 'img/' + img + '.png';
    adapter.setObjectNotExists(prefix, {
        type:   'device',
        common: {name: devices[index].conf.name.val, type: 'string', icon: icon},
        native: {id: prefix}
    }, () => {
        adapter.extendObject(prefix, {common: {name: devices[index].conf.name.val, type: 'string', icon: icon}});
        setStates(index, prefix + '.RAW', 'Send RAW command to counter', '');
    });
}

function setObjects(index){
    adapter.log.debug('------------ setObjects -------------');
    let name, val;
    const obj = devices[index].metering;
    let desc = '';
    let unit = '';
    const prefix = devices[index].info.sn.val;
    setDev(index);
    for (const key1 in obj) {
        if (!Object.hasOwnProperty.call(obj, key1)) continue;
        name = prefix + '.' + key1;
        //adapter.log.debug('key1 = ' + key1 + ' / name = ' + name);
        if (obj[key1]['val'] === undefined){
            const obj1 = obj[key1];
            for (const key2 in obj1) {
                if (!Object.hasOwnProperty.call(obj1, key2)) continue;
                name = prefix + '.' + key1 + '.' + key2;
                //adapter.log.debug('key2 = ' + key2 + ' / name = ' + name);
                if (obj1[key2]['val'] === undefined){
                    const obj2 = obj1[key2];
                    for (const key3 in obj2) {
                        if (!Object.hasOwnProperty.call(obj2, key3)) continue;
                        name = prefix + '.' + key1 + '.' + key2 + '.' + key3;
                        //adapter.log.debug('key3 = ' + key3 + ' / name = ' + name);
                        if (obj2[key3]['val'] === undefined){
                            const obj3 = obj2[key3];
                            for (const key4 in obj3) {
                                if (!Object.hasOwnProperty.call(obj3, key4)) continue;
                                desc = obj3[key4].desc;
                                unit = obj3[key4].unit;
                                val = obj3[key4].val;
                                name = prefix + '.' + key1 + '.' + key2 + '.' + key3 + '.' + key4;
                                //adapter.log.debug('key4 = ' + key4 + ' / name = ' + name);
                                setStates(index, name, desc, val, unit);
                            }
                        } else {
                            desc = obj2[key3].desc;
                            unit = obj2[key3].unit;
                            val = obj2[key3].val;
                            setStates(index, name, desc, val, unit);
                        }
                    }
                } else {
                    desc = obj1[key2].desc;
                    unit = obj1[key2].unit;
                    val = obj1[key2].val;
                    setStates(index, name, desc, val, unit);
                }
            }
        } else {
            desc = obj[key1].desc;
            unit = obj[key1].unit;
            val = obj[key1].val;
            setStates(index, name, desc, val, unit);
        }
    }
}

if (module.parent){
    module.exports = startAdapter;
} else {
    startAdapter();
}
