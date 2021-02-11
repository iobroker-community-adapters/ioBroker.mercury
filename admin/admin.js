const namespace = 'mercury.' + instance,
    namespaceLen = namespace.length;
let devices = [];
let options = {};
let serialPorts = [];
let lang;

function load(settings, onChange){
    if (!settings) return;
    lang = systemLang || 'en';
    //isAlive = getAlive;
    getOptions();
    console.log('///// settings ////// ' + JSON.stringify(settings));
    $('.value').each(function (){
        const $key = $(this);
        const id = $key.attr('id');
        if ($key.attr('type') === 'checkbox'){
            $key.prop('checked', settings[id]).change(function (){
                onChange();
            });
        } else {
            $key.val(settings[id]).change(function (){
                onChange();
            }).keyup(function (){
                onChange();
            });
        }
    });
    selectTypeConn();
    getDevices();
    onChange(false);
    //console.log('systemLang - ' + systemLang);
}

$(document).ready(function (){
    sockets();
    $('.modal').modal();
    $('#typeconnect').on('change', selectTypeConn);
    $('#add-button').click(function (){
        if (!isAlive){
            showMessage(_('driver is not running'), _('Error'), 'error_outline');
            return false;
        }
    });
    $('#discovery-btn').click(function (){
        findeDevice();
    });

    $('.serial-list-btn').click(function (){
        $('#usbport').focus().click();
    });
    $('#meters-list-add').change(function (){
        const model = $('#meters-list-add option:selected').val();
        if (options.model[model].type === 1){
            $('#userandpassword').hide();
        } else {
            $('#userandpassword').show();
        }
        //M.updateTextFields();
    });
    $('.modaladd').modal({
        onOpenStart(){
            let l = 'ru';
            if (lang !== 'ru'){
                l = 'en';
            }
            $('#userandpassword').hide();
            for (const key in options.model) {
                $('#meters-list-add').append('<option value="' + key + '">' + options.model[key].desc[l] + '</option>');
            }
            $('#meters-list-add').val(200).select();
            if (!$('#meters-list-add option:selected').val()){
                $('#finddev-user').val(1).select();
            }
        },
    });
    //console.log('/////settings////// ' + JSON.stringify(e));
    M.updateTextFields();
});

function findeDevice(){
    const addr = $('#address').val();
    const model = $('#meters-list-add option:selected').val();
    const user = $('#finddev-user option:selected').val();
    const pwd = $('#finddev-password').val();
    if (model){
        console.log('/////findeDevice///addr/// ' + JSON.stringify(addr));
        console.log('/////findeDevice///model/// ' + JSON.stringify(model));
        window.parent.$('#connecting').show();
        const timer = setTimeout(function (){
            window.parent.$('#connecting').hide();
            showMessage(_('No response, retry the request'), _('Error'), 'error_outline');
        }, 15000);
        sendTo(namespace, 'findDevice', {addr, model, user, pwd}, function (msg){
            window.parent.$('#connecting').hide();
            //console.log('/////findeDevice///msg/// ' + JSON.stringify(msg));
            clearTimeout(timer);
            if (msg){
                if (msg.error){
                    //console.log('/////findeDevice///msg.error/// ' + JSON.stringify(msg.error));
                    showMessage(_(msg.error), _('Error'), 'error_outline');
                    msg = null;
                } else {
                    devices = msg;
                    $('.modal').modal('close');
                    showDevices();
                }
            }
        });
    }
}

function getOptions(){
    sendTo(namespace, 'getOptions', {}, function (msg){
        if (msg){
            if (msg.error){
                showMessage(_(msg.error), _('Error'), 'error_outline');
            } else {
                options = msg;
                appendModelList(options);
            }
        }
    });
}

function appendModelList(options){
    let l = 'ru';
    if (lang !== 'ru'){
        l = 'en';
    }
    for (const key in options.model) {
        $('#meters-list').append('<option value="' + key + '">' + options.model[key].desc[l] + '</option>');
    }
    $('#meters-list.value').val(200).select();
}

function getSerialPorts(){
    console.log('getSerialPorts ' + namespace);
    sendTo(namespace, 'getSerialPorts', {}, function (msg){
        console.log('serialPorts =  ' + JSON.stringify(msg));
        if (msg){
            if (msg.error){
                showMessage(_(msg.error), _('Error'), 'error_outline');
            } else {
                serialPorts = msg;
                $('#serial-list').empty();
                $.each(serialPorts, function (i, item){
                    $('#serial-list').append($('<option>').text(item.path));
                });
                M.updateTextFields();
            }
        }
    });
}

function getDevices(){
    console.log('namespace ' + namespace);
    sendTo(namespace, 'getDevices', {}, function (msg){
        if (msg){
            if (msg.error){
                showMessage(_(msg.error), _('Error'), 'error_outline');
            } else {
                devices = msg;
                showDevices();
            }
        }
    });
}

function getCard(dev, i){
    //console.log(JSON.stringify(dev));
    let _lang;
    if (lang !== 'ru'){
        _lang = 'en';
    } else {
        _lang = 'ru';
    }
    if (dev){
        const id = i;
        let info = '<li style="display: flow-root;"><span class="info-reveal-left translate">' + _(dev.conf.model.desc) + ': </span><span class="info-reveal-right translate">' + dev.conf.model.name[_lang] + '</span></li>' +
            '<li style="display: flow-root;"><span class="info-reveal-left translate">' + _(dev.conf.name.desc) + ': </span><span class="info-reveal-right translate">' + dev.conf.name.val + '</span></li>' +
            '<li style="display: flow-root;"><span class="info-reveal-left translate">' + _(dev.conf.addr.desc) + ': </span><span class="info-reveal-right translate">' + dev.conf.addr.val + '</span></li>';
        for (const key in dev.info) {
            info += '<li style="display: flow-root;"><span class="info-reveal-left ">' + _(dev.info[key].desc) + ': </span><span class="info-reveal-right translate">' + dev.info[key].val + '</span></li>';
        }
        let config = '';
        if (dev.conf.user.val === 1){
            config = 'disabled';
        }
        let img = parseInt(dev.conf.model.val);
        if (img === 230 || img === 231 || img === 234){
            img = img + '' + dev.info.typeCount.val;
        }

        //console.log('88888888 = ' + JSON.stringify(dev));
        const card = '<div id="' + id + '" class="col m4 s3 l3 xl3">' +
            '<div class="card">' +
            '<div class="card hoverable">' +
            '<div class="card-image waves-effect waves-block waves-light">' +
            '<img class="activator" src="img/' + img + '.png" onerror="this.src=\'img/noimage.png\'">' +
            '</div>' +
            '<div class="card-content">' +
            '<span class="card-title activator grey-text text-darken-3 translate">' + dev.conf.model.name[_lang] + '</span>' +
            '<p style="margin-bottom: 5px; margin-top: -5px;"class="grey-text text-darken-4">' + _('name') + ': ' + dev.conf.name.val + '</p>' +
            '<a id="modal-settings-btn" class="btn-floating btn-small waves-effect waves-light blue modal-trigger hoverable" href="#modalsettings" onClick="settingDevice(' + id + ')"><i class="material-icons right">settings</i></a>' +
            //'<a id="modal-config-btn" ' + config + ' class="btn-floating btn-small waves-effect waves-light blue modal-trigger hoverable" href="#modalconfig"><i class="material-icons right">build</i></a>' +
            '<a class="btn-floating btn-small waves-effect waves-light blue modal-trigger right hoverable" href="#modalconfirmdelete" onClick="confirmDelete(' + id + ')"><i class="material-icons right">delete</i></a>' +
            '</div>' +
            '<div class="card-reveal">' +
            '<span class="card-title grey-text text-darken-4 translate">' + _('info') + '<i class="material-icons right">close</i></span>' +
            '<ul id="info-reveal">' +
            info +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        return card;
    }
}

function showDevices(){
    let html = '';
    $('#devices').html(html);
    //const lang = systemLang || 'en';
    if (devices.length > 0){
        for (let i = 0; i < devices.length; i++) {
            const d = devices[i];
            const cards = getCard(d, i);
            html += cards;
        }
        $('#devices').html(html);
    }
}

function sockets(){
    socket.emit('subscribe', namespace + '.info.*');
    socket.emit('subscribeObjects', namespace + '.*');
    socket.on('stateChange', function (id, state){
        if (id.substring(0, namespaceLen) !== namespace) return;
        if (state){

        }
    });
    socket.on('objectChange', function (id, obj){
        if (id.substring(0, namespaceLen) !== namespace) return;
        if (obj && obj.type == 'device' && obj.common.type !== 'group'){

        }
    });
    socket.emit('getObject', 'system.config', function (err, res){
        if (!err && res && res.common){
            systemLang = res.common.language || systemLang;
            systemConfig = res;
        }
    });
}

function confirmDelete(index){
    $('#modalconfirmdelete-agree').removeAttr('onclick').attr('onClick', 'deleteDevice(' + index + ');');
}

function deleteDevice(index){
    sendTo(namespace, 'deleteDevice', {index}, function (msg){
        if (msg){
            if (msg.error){
                showMessage(_(msg.error), _('Error'), 'error_outline');
            } else {
                devices = msg;
                //console.log('/////deleteDevice////// ' + JSON.stringify(devices));
                showDevices();
            }
        }
    });
}

function settingDevice(index){
    $('#meters-list').val(devices[index].conf.model.val).select();
    $('#settings-address').val(devices[index].conf.addr.val);
    if (devices[index].conf.protocol.val === 1){
        $('#modal-settings-user').hide();
        $('#modal-settings-password').hide();
    } else {
        $('#modal-settings-user').show();
        $('#modal-settings-password').show();
        $('#settings-user').val(devices[index].conf.user.val).select();
        $('#password').val(devices[index].conf.pwd.val.toString().replace(/,/g, ''));
    }
    $('#name').val(devices[index].conf.name.val);
    M.updateTextFields();
    $('#modal-settings-agree').removeAttr('onclick').attr('onClick', 'settingsAgree(' + index + ');');
}

function settingsAgree(index){
    devices[index].conf.model.val = $('#meters-list option:selected').val();
    devices[index].conf.addr.val = parseInt($('#settings-address').val(), 10);
    if (devices[index].conf.protocol.val === 2){
        devices[index].conf.user.val = parseInt($('#settings-user option:selected').val(), 10);
        devices[index].conf.pwd.val = parseInt($('#password').val(), 10);
    }
    devices[index].conf.name.val = $('#name').val();
    const conf = devices[index].conf;
    console.log('Send  update Devices' + JSON.stringify(conf));
    sendTo(namespace, 'updateDevices', {conf, index}, function (msg){
        if (msg){
            if (msg.error){
                showMessage(_(msg.error), _('Error'), 'error_outline');
            } else {
                //options = msg;
                devices = msg;
                showDevices();
            }
        }
    });
}

function selectTypeConn(){
    if ($('select#typeconnect option:checked').val() === 'tcp'){
        $('#usb-block').hide();
        $('#tcp-block').show();
    } else {
        getSerialPorts();
        $('#tcp-block').hide();
        $('#usb-block').show();
    }
}

const isAlive = function (){
    socket.emit('getState', 'system.adapter.' + namespace + '.alive', function (err, res){
        if (!err && res){
            console.log('isAlive = ' + res.val);
            return res.val;
        } else {
            return false;
        }
    });
};

function save(callback){
    // example: select elements with class=value and build settings object
    const obj = {};
    $('.value').each(function (){
        const $this = $(this);
        if ($this.attr('type') === 'checkbox'){
            obj[$this.attr('id')] = $this.prop('checked');
        } else {
            obj[$this.attr('id')] = $this.val();
        }
    });
    callback(obj);
}



