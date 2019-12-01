'use strict';
const utils = require('@iobroker/adapter-core');
const fs = require('fs');
const net = require('net');
const m = require('./lib/mercury.js');
const SerialPort = require('serialport');
const mercury = new net.Socket();
let serial;
//let _serial;
//const InterByteTimeout = require('serialport/parser-inter-byte-timeout');
let adapter, _callback, timeout;
let devices = [], dataFile = 'devices.json', isPoll = false, isOnline = false, iter = 0, n = 0, firstStart = true,
    pollingTime = 60000, pollingInterval = null;

const msg = {cmd: [], protocol: null, addr: 0, pwd: [], user: 1};

function startAdapter(options){
    return adapter = utils.adapter(Object.assign({}, options, {
        systemConfig: true,
        name:         'mercury',
        ready:        main, // Main method defined below for readability
        unload:       (callback) => {
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
                id = id.substring(adapter.namespace.length + 1);
                switch (id) {
                    case 'states.raw':
                        const msg = '';
                        //TODO
                        send(msg, function (response){
                            adapter.log.debug('Ответ получен - ' + JSON.stringify(response));
                            adapter.setState('raw', {val: JSON.stringify(response), ack: true});
                        });
                        break;
                    default:
                }
            } else {
                // The state was deleted
                //adapter.log.info(`state ${id} deleted`);
            }
        },
        message:      obj => {
            if (typeof obj === 'object' && obj.command){
                //adapter.log.debug(`message ******* ${JSON.stringify(obj)}`);
                if (obj.command === 'getDevices'){
                    obj.callback && adapter.sendTo(obj.from, obj.command, devices, obj.callback);
                }
                if (obj.command === 'getOptions'){
                    obj.callback && adapter.sendTo(obj.from, obj.command, m.options, obj.callback);
                }
                if (obj.command === 'findDevice'){
                    if (isOnline){
                        _callback = function (e){
                            if (e) adapter.log.error('findDevice ERROR ---' + JSON.stringify(e));
                            isPoll = true;
                            obj.callback && adapter.sendTo(obj.from, obj.command, e ? {error: e} :devices, obj.callback);
                        };
                        findDevice(obj.message);
                    } else {
                        obj.callback && adapter.sendTo(obj.from, obj.command, {error: 'No connection to the device'}, obj.callback);
                    }
                }
                if (obj.command === 'updateDevices'){
                    if (obj.message.conf.pwd.val !== null){
                        obj.message.conf.pwd.val = obj.message.conf.pwd.val.toString().split('');
                    }
                    devices[obj.message.index].conf = obj.message.conf;
                    devices[obj.message.index].conf.model.name = m.options.model[obj.message.conf.model.val].desc;
                    saveDevices();
                    obj.callback && adapter.sendTo(obj.from, obj.command, devices, obj.callback);
                }
                if (obj.command === 'deleteDevice'){
                    devices.splice(obj.message.index, 1);
                    saveDevices();
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

function setStates(index, name, desc, val){
    if (val > -5 && val < 0) val = 0;
    adapter.getState(name, function (err, state){
        adapter.log.debug('getState / err = ' + err + ' / name = ' + name + ' / state = ' + JSON.stringify(state));
        if (err || !state){
            const role = 'state';
            //adapter.log.debug('setObject = ' + name);
            adapter.setObject(name, {
                type:   'state',
                common: {
                    name: desc,
                    desc: desc,
                    type: 'number',
                    role: role
                },
                native: {}
            });
            adapter.setState(name, {val: val, ack: true});
        } else {
            adapter.log.debug('state.val = ' + state.val + '/ val = ' + val);
            if (state.val !== val){
                adapter.setState(name, {val: val, ack: true});
            }
        }
    });
}

function setDev(index){
    const prefix = devices[index].info.sn.val;
    let img = parseInt(devices[index].conf.model.val);
    if (img === 230 || img === 231 || img === 234){
        img = img + '' + devices[index].info.typeCount.val;
    }
    const icon = 'img/' + img + '.png';
    adapter.setObjectNotExists(prefix, {
        type:   'device',
        // actually this is an error, so device.common has no attribute type. It must be in native part
        common: {name: devices[index].conf.name.val, type: 'counter', icon: icon},
        native: {id: prefix}
    }, () => {
        // update type and icon
        adapter.extendObject(prefix, {common: {name: devices[index].conf.name.val, type: 'counter', icon: icon}});
    });
}

function setObjects(index){
    adapter.log.debug('- setObjects -');
    let name, val;
    const obj = devices[index].metering;
    let desc = '';
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
                                val = obj3[key4].val;
                                name = prefix + '.' + key1 + '.' + key2 + '.' + key3 + '.' + key4;
                                //adapter.log.debug('key4 = ' + key4 + ' / name = ' + name);
                                setStates(index, name, desc, val);
                            }
                        } else {
                            desc = obj2[key3].desc;
                            val = obj2[key3].val;
                            setStates(index, name, desc, val);
                        }
                    }
                } else {
                    desc = obj1[key2].desc;
                    val = obj1[key2].val;
                    setStates(index, name, desc, val);
                }
            }
        } else {
            desc = obj[key1].desc;
            val = obj[key1].val;
            setStates(index, name, desc, val);
        }
    }
}

function poll(){
    if (isPoll){
        n = 0;
        for (let index = 0; index < devices.length; index++) {
            msg.protocol = devices[index].conf.protocol.val;
            if (msg.protocol === 2){
                adapter.log.debug('Опрашиваем счетчик # ' + index);
                openChannel(index, msg, function (e){
                    if (!e){
                        if (!firstStart){
                            sendPolling(index, msg.protocol, 'poll');
                        } else {
                            isPoll = false;
                            sendPolling(index, msg.protocol, 'first');
                        }
                    } else {
                        adapter.log.debug(e);
                    }
                });
            } else {
                if (!firstStart){
                    sendPolling(index, msg.protocol, 'poll');
                } else {
                    isPoll = false;
                    sendPolling(index, msg.protocol, 'first');
                }
            }
        }
        //TODO перенести из sendPolling, выполнять только после опроса всех счетчиков
        //n = 0;
        /*if(nameArray === 'first'){
            firstStart = false;
        }
        isPoll = true;
        adapter.log.debug('Распарсили, пишем состояния.' + JSON.stringify(devices));
        setObjects(index);*/
    }
}

function sendPolling(index, protocol, nameArray, cb){
    if (devices.length > 0){
        //adapter.log.debug('sendPolling - = ' + m.options.protocol[protocol][nameArray][n].desc);
        msg.cmd = [devices[index].conf.addr.val, m.options.protocol[protocol][nameArray][n].code].concat(m.options.protocol[protocol][nameArray][n].cmd);
        adapter.log.debug('Читаем - ' + m.options.protocol[protocol][nameArray][n].desc + '. cmd = ' + JSON.stringify(msg.cmd));
        send(msg, function (response){
            adapter.log.debug('Ответ получен, парсим');
            devices = m.options.protocol[protocol][nameArray][n].func(devices, index, msg.cmd, response);
            n++;
            if (n > m.options.protocol[protocol][nameArray].length - 1){
                n = 0;
                if (nameArray === 'first'){
                    firstStart = false;
                }
                isPoll = true;
                adapter.log.debug('Распарсили, пишем состояния.'/* + JSON.stringify(devices)*/);
                setObjects(index);
            } else {
                sendPolling(index, protocol, nameArray, cb);
            }
        });
    }
}

function findDevice(_msg){
    adapter.log.debug('findDevice msg ---' + JSON.stringify(_msg)); //{"addr":"","model":"230"}
    isPoll = false;
    msg.cmd = [];
    msg.addr = _msg.addr.toString();
    msg.user = parseInt(_msg.user, 10);
    msg.model = parseInt(_msg.model, 10);
    msg.protocol = m.options.model[_msg.model].type;
    msg.modelname = m.options.model[_msg.model].desc;
    msg.pwd = (_msg.pwd.toString().split('')).map(function (x){
        return parseInt(x, 10);
    });
    if (msg.model && !msg.addr && msg.protocol === 2){
        adapter.log.debug('Поиск трехфазного с адресом - 0');
        openChannel(null, msg, function (e){
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
            let _addr = Buffer.allocUnsafe(4);
            _addr.writeUInt32BE(parseInt(msg.addr, 10), 0);
            _addr = Array.prototype.slice.call(_addr, 0);
            msg.cmd = /*[0x00]*/msg.cmd.concat(_addr, [0x2f]);
            adapter.log.debug('Поиск однофазного с адресом - ' + msg.addr);
            send(msg);
        }
        if (msg.protocol === 2){
            if (msg.addr.length > 2){
                msg.addr = parseInt(msg.addr.substr(msg.addr.length - 3));
                if (parseInt(msg.addr, 10) > 240){
                    msg.addr = parseInt(msg.addr.substr(msg.addr.length - 2));
                }
            }
            msg.addr = parseInt(msg.addr, 10);
            adapter.log.debug('Поиск треxфазного с адресом - ' + msg.addr);
            openChannel(null, msg, function (e){
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
        if (response[0] === 0 && response[4] === 47){  //hex 2f //Ответ на поиск 1 фазного
            const addrInt = response.readUInt32BE(1);
            const index = getIndexDevice(addrInt);
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
            const index = getIndexDevice(response[2]);
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
    adapter.log.debug('Получаем информацию о счетчике. iter=' + iter);
    adapter.log.debug('Длинна readinfo =' + m.options.protocol[msg.protocol].readinfo.length);
    msg.cmd = [];
    let addr = [devices[index].conf.addr.val];
    if (msg.protocol === 1){
        const _addr = Buffer.allocUnsafe(4);
        _addr.writeUInt32BE(addr, 0);
        addr = (Array.prototype.slice.call(_addr, 0)).unshift(0x00);
        adapter.log.debug('Извлекаем адрес однофазного счетчика из серийного номера. addr = ' + JSON.stringify(addr));
    }
    msg.cmd = msg.cmd.concat(addr, m.options.protocol[msg.protocol].readinfo[iter].code, [m.options.protocol[msg.protocol].readinfo[iter].cmd]);
    send(msg, function (response){
        adapter.log.debug('Ответ получен, парсим пакет - ' + m.options.protocol[msg.protocol].readinfo[iter].desc);
        devices = m.options.protocol[msg.protocol].readinfo[iter].func(devices, index, msg, response);
        iter++;
        if (iter > m.options.protocol[msg.protocol].readinfo.length - 1){
            iter = 0;
            saveDevices();
            //adapter.log.debug('Распарсили, возвращаем массив устройств.' + JSON.stringify(devices));
            _callback();
        } else {
            getDeviceInfo(index, msg, cb);
        }
    });
}

function send(msg, cb){
    //adapter.log.debug('mercury._events.data' + JSON.stringify(mercury._events.data));
    mercury._events.data = undefined;
    //serial._events.data = null;
    clearTimeout(timeout);
    timeout = setTimeout(function (){
        adapter.log.error('No response');
        mercury._events.data = undefined;
        if (serial) serial._events.data = null;
        isPoll = true;
        _callback && _callback('No response');
    }, 5000);
    if (!serial){
        adapter.log.debug('send tcp');
        mercury.once('data', (response) => {
            clearTimeout(timeout);
            adapter.log.debug('RESPONSE = ' + JSON.stringify(response));
            if (checkCRC(response)){
                if (cb){
                    setTimeout(function (){
                        cb(response);
                    }, 100);
                } else {
                    parseFindPacket(response, msg, cb);
                }
            } else {
                adapter.log.error('Check CRC in response packet, CRC Error');
                isPoll = true;
                //cb && cb('CRC Error');
                _callback && _callback('CRC Error');
            }
        });
    } else {
        adapter.log.debug('send serial');
        serial.on('data', function (response){
            clearTimeout(timeout);
            //serial._events.data = null;
            adapter.log.debug('RESPONSE = ' + JSON.stringify(response));
            if (checkCRC(response)){
                if (cb){
                    setTimeout(function (){
                        cb(response);
                    }, 100);
                } else {
                    parseFindPacket(response, msg, cb);
                }
            } else {
                adapter.log.error('Check CRC in response packet, CRC Error');
                isPoll = true;
                //cb && cb('CRC Error');
                _callback && _callback('CRC Error');
            }
        });
    }
    const b1 = ((m.crc(msg.cmd) >> 8) & 0xff);
    msg.cmd[msg.cmd.length] = (m.crc(msg.cmd) & 0xff);
    msg.cmd[msg.cmd.length] = b1;
    const buf = Buffer.from(msg.cmd);
    adapter.log.debug('Send cmd - ' + m.toHexString(msg.cmd) + ' to device [' + msg.cmd[0] + ']');
    serial ? serial.write(buf) :mercury.write(buf);
}

function main(){
    if (!adapter.systemConfig) return;
    adapter.subscribeStates('*');
    pollingTime = adapter.config.pollingtime ? adapter.config.pollingtime * 1000 :60000;
    const dir = utils.controllerDir + '/' + adapter.systemConfig.dataDir + adapter.namespace.replace('.', '_') + '/';
    dataFile = dir + dataFile;
    adapter.log.debug('adapter.config = ' + JSON.stringify(adapter.config));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.readFile(dataFile, (err, data) => {
        if (!err){
            try {
                devices = JSON.parse(data);
            } catch (err) {
                fs.writeFile(dataFile, '', (err) => {
                    if (err) adapter.log.error('writeFile ERROR = ' + JSON.stringify(err));
                });
            }
        } else {
            fs.writeFile(dataFile, '', (err) => {
                if (err) adapter.log.error('writeFile ERROR = ' + JSON.stringify(err));
            });
        }
    });
    if (adapter.config.typeconnect === 'tcp' && adapter.config.ip && adapter.config.tcpport){
        connectTCP();
    } else if (adapter.config.typeconnect === 'usb' && adapter.config.usbport){
        try {
            serial = new SerialPort(adapter.config.usbport, {
                baudRate: parseInt(adapter.config.baud, 10),
                parity:   adapter.config.parity ? 'even' :'none', //'none', 'even', 'mark', 'odd', 'space'.
                dataBits: 8
                //stopBits:    1
                //flowControl: false
            });
            connectSerial();
        } catch (e) {
            adapter.log.error('SerialPort ERROR = ' + JSON.stringify(e));
        }
    }
}

function connectSerial(){
    /*serial.open(function (err){
        if (err){
            return console.log('Error opening port: ', err.message);
        }
    });*/

    serial.on('open', function (){
        adapter.log.info('Connected to port ' + adapter.config.usbport);
        adapter.setState('info.connection', true, true);
        isPoll = true;
        isOnline = true;
        pollingInterval = setInterval(function (){
            if (devices.length > 0){
                poll();
            }
        }, pollingTime);
    });

    //_serial = serial.pipe(new InterByteTimeout({interval: 30}));
    //serial.pipe(_serial);

    serial.on('readable', function (){
        adapter.log.debug('readable Data:', serial.read());
    });
    serial.on('error', function (err){
        adapter.log.error('Serial ERROR: ' + JSON.stringify(err));
    });
    serial.on('close', function (err){
        adapter.log.debug('serial closed' + JSON.stringify(err));
        //reconnect();
    });
}

function reconnect(){
    isPoll = false;
    isOnline = false;
    adapter.setState('info.connection', false, true);
    adapter.log.debug('Mercury reconnect after 10 seconds');
    setTimeout(function (){
        mercury.removeAllListeners();
        serial ? connectSerial() :connectTCP();
    }, 10000);
}

function connectTCP(){
    adapter.log.debug('Connect to ' + adapter.config.ip + ':' + adapter.config.tcpport);
    mercury.connect({host: adapter.config.ip, port: adapter.config.tcpport}, () => {
        adapter.log.info('Connected to server ' + adapter.config.ip + ':' + adapter.config.tcpport);
        adapter.setState('info.connection', true, true);
        isPoll = true;
        isOnline = true;
        pollingInterval = setInterval(function (){
            if (devices.length > 0){
                poll();
            }
        }, pollingTime);
    });
    mercury.on('close', (e) => {
        adapter.log.debug('closed ' + JSON.stringify(e));
        //reconnect();
    });
    mercury.on('error', (e) => {
        adapter.log.error('Mercury ERROR: ' + JSON.stringify(e));
        if (e.code === 'EISCONN' || e.code === 'EPIPE' || e.code === 'EALREADY' || e.code === 'EINVAL') reconnect();
    });
    mercury.on('end', () => {
        adapter.log.debug('Disconnected from server');
        reconnect();
        _callback && _callback('Disconnected from server');
    });
}

function openChannel(index, msg, cb){
    msg.addr = index ? devices[index].conf.addr.val :msg.addr;
    msg.protocol = index ? devices[index].conf.protocol.val :msg.protocol;
    if (index !== null){
        msg.pwd = devices[index].conf.pwd.val;
        msg.user = parseInt(devices[index].conf.user.val, 10);
    }
    msg.cmd = [msg.addr, 0x01, msg.user].concat(msg.pwd);
    adapter.log.debug('Открываем канал связи msg = ' + JSON.stringify(msg));
    send(msg, function (response){
        if (response[1] === 0){
            adapter.log.debug('Канал связи открыт');
            cb();
        } else {
            cb('Error opening communication channel');
        }
    });
}

const getIndexDevice = function (addr){
    devices.forEach(function (item, i){
        if (devices[i].conf.addr === addr){
            return i;
        }
    });
    return devices.length;
};

function saveDevices(){
    const data = JSON.stringify(devices, null, 2);
    fs.writeFile(dataFile, data, (err) => {
        if (err) throw err;
        adapter.log.debug('Devices data written to file');
    });
}

const checkCRC = function (buf){
    const crc_packet = (buf.slice(buf.length - 2, buf.length)).toJSON().data.toString();
    const crc_calc = [(m.crc(buf.slice(0, buf.length - 2)) & 0xff), ((m.crc(buf.slice(0, buf.length - 2)) >> 8) & 0xff)].toString();
    if (crc_packet === crc_calc){
        adapter.log.debug('CRC check packet successfully - CRC packet(' + JSON.stringify(crc_packet) + ') = CRC calc(' + JSON.stringify(crc_calc) + ')');
        return true;
    } else {
        adapter.log.debug('check CRC error - CRC packet(' + JSON.stringify(crc_packet) + ') != CRC calc(' + JSON.stringify(crc_calc) + ')');
        return false;
    }
};

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

if (module.parent){
    module.exports = startAdapter;
} else {
    startAdapter();
}
