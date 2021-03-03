'use strict';
const EventEmitter = require('events');
const event = new EventEmitter();
event.setMaxListeners(10);
module.exports = event;

const translate = function (w){ // PLEASE HELP WITH THE TRANSLATION
    const word = {
        'DateTime':                             {ru: 'Дата/Время', en: 'Date Time'},
        'Serial number':                        {ru: 'Серийный номер', en: 'Serial number'},
        'Production date':                      {ru: 'Дата изготовления', en: 'Production date'},
        'Software version':                     {ru: 'Версия ПО', en: 'Software version'},
        'power':                                {ru: 'Мощность', en: 'Power'},
        'current':                              {ru: 'Ток', en: 'Current'},
        'voltage':                              {ru: 'Напряжение', en: 'Voltage'},
        'oneTarrifEnergyActive':                {ru: 'Энергия по 1 тарифу', en: 'Energy at 1 tariff'},
        'twoTarrifEnergyActive':                {ru: 'Энергия по 2 тарифу', en: 'Energy at 2 tariff'},
        'threeTarrifEnergyActive':              {ru: 'Энергия по 3 тарифу', en: 'Energy at 3 tariff'},
        'fourTarrifEnergyActive':               {ru: 'Энергия по 4 тарифу', en: 'Energy at 4 tariff'},
        'TotalEnergyActive':                    {ru: 'Энергия итого', en: 'Total energy'},
        'oneTarrifEnergy':                      {ru: 'Энергия по 1 тарифу', en: 'Energy at 1 tariff'},
        'twoTarrifEnergy':                      {ru: 'Энергия по 2 тарифу', en: 'Energy at 2 tariff'},
        'threeTarrifEnergy':                    {ru: 'Энергия по 3 тарифу', en: 'Energy at 3 tariff'},
        'fourTarrifEnergy':                     {ru: 'Энергия по 4 тарифу', en: 'Energy at 4 tariff'},
        'TotalEnergy':                          {ru: 'Энергия итого', en: 'Total energy'},
        'battery':                              {ru: 'Напряжение батарейки', en: 'Battery voltage'},
        'voltageOn':                            {ru: 'Время последнего включения напряжения', en: 'Time of the last voltage turn on'},
        'voltageOff':                           {ru: 'Время последнего отключения напряжения', en: 'Time of the last voltage turn off'},
        'limitPower':                           {ru: 'Лимит мощности', en: 'Power limit'},
        'limitEnergyMonth':                     {ru: 'Лимит энергии за месяц', en: 'Monthly energy limit'},
        'totalEnergyActivePlus':                {ru: 'Энергия А+ итого', en: 'Energy A+ total'},
        'totalEnergyActiveMinus':               {ru: 'Энергия А- итого', en: 'Energy A- total'},
        'totalEnergyReactivePlus':              {ru: 'Энергия R+ итого', en: 'Energy R+ total'},
        'totalEnergyReactiveMinus':             {ru: 'Энергия R- итого', en: 'Energy R- total'},
        'currentYearTotalEnergyActivePlus':     {ru: 'Энергия А+ итого', en: 'Energy A+ total'},
        'currentYearTotalEnergyActiveMinus':    {ru: 'Энергия А- итого', en: 'Energy A- total'},
        'currentYearTotalEnergyReactivePlus':   {ru: 'Энергия R+ итого', en: 'Energy R+ total'},
        'currentYearTotalEnergyReactiveMinus':  {ru: 'Энергия R- итого', en: 'Energy R- total'},
        'currentDayTotalEnergyActivePlus':      {ru: 'Энергия А+ итого', en: 'Energy A+ total'},
        'currentDayTotalEnergyActiveMinus':     {ru: 'Энергия А- итого', en: 'Energy A- total'},
        'currentDayTotalEnergyReactivePlus':    {ru: 'Энергия R+ итого', en: 'Energy R+ total'},
        'currentDayTotalEnergyReactiveMinus':   {ru: 'Энергия R- итого', en: 'Energy R- total'},
        'oneTarrifEnergyActivePlus':            {ru: 'Энергия А+ 1 тариф', en: 'Energy A+ 1 tariff'},
        'oneTarrifEnergyActiveMinus':           {ru: 'Энергия А- 1 тариф', en: 'Energy A- 1 tariff'},
        'oneTarrifEnergyReactivePlus':          {ru: 'Энергия R+ 1 тариф', en: 'Energy R+ 1 tariff'},
        'oneTarrifEnergyReactiveMinus':         {ru: 'Энергия R- 1 тариф', en: 'Energy R- 1 tariff'},
        'twoTarrifEnergyActivePlus':            {ru: 'Энергия А+ 2 тариф', en: 'Energy A+ 1 tariff'},
        'twoTarrifEnergyActiveMinus':           {ru: 'Энергия А- 2 тариф', en: 'Energy A- 1 tariff'},
        'twoTarrifEnergyReactivePlus':          {ru: 'Энергия R+ 2 тариф', en: 'Energy R+ 1 tariff'},
        'twoTarrifEnergyReactiveMinus':         {ru: 'Энергия R- 2 тариф', en: 'Energy R- 1 tariff'},
        'threeTarrifEnergyActivePlus':          {ru: 'Энергия А+ 3 тариф', en: 'Energy A+ 1 tariff'},
        'threeTarrifEnergyActiveMinus':         {ru: 'Энергия А- 3 тариф', en: 'Energy A- 1 tariff'},
        'threeTarrifEnergyReactivePlus':        {ru: 'Энергия R+ 3 тариф', en: 'Energy R+ 1 tariff'},
        'threeTarrifEnergyReactiveMinus':       {ru: 'Энергия R- 3 тариф', en: 'Energy R- 1 tariff'},
        'fourTarrifEnergyActivePlus':           {ru: 'Энергия А+ 4 тариф', en: 'Energy A+ 1 tariff'},
        'fourTarrifEnergyActiveMinus':          {ru: 'Энергия А- 4 тариф', en: 'Energy A- 1 tariff'},
        'fourTarrifEnergyReactivePlus':         {ru: 'Энергия R+ 4 тариф', en: 'Energy R+ 1 tariff'},
        'fourTarrifEnergyReactiveMinus':        {ru: 'Энергия R- 4 тариф', en: 'Energy R- 1 tariff'},
        'powerTotal':                           {ru: 'Активная мощность итого', en: 'Active power total'},
        'powerPhase1':                          {ru: 'Активная мощность 1 фаза', en: 'Active power 1 phase'},
        'powerPhase2':                          {ru: 'Активная мощность 2 фаза', en: 'Active power 2 phase'},
        'powerPhase3':                          {ru: 'Активная мощность 3 фаза', en: 'Active power 3 phase'},
        'voltagePhase1':                        {ru: 'Напряжение 1 фаза', en: 'Voltage 1 phase'},
        'voltagePhase2':                        {ru: 'Напряжение 2 фаза', en: 'Voltage 2 phase'},
        'voltagePhase3':                        {ru: 'Напряжение 3 фаза', en: 'Voltage 3 phase'},
        'currentPhase1':                        {ru: 'Ток 1 фаза', en: 'Current 1 phase'},
        'currentPhase2':                        {ru: 'Ток 2 фаза', en: 'Current 2 phase'},
        'currentPhase3':                        {ru: 'Ток 3 фаза', en: 'Current 3 phase'},
        'cosfTotal':                            {ru: 'Коэффициент мощности среднее', en: 'Power factor total'},
        'cosfPhase1':                           {ru: 'Коэффициент мощности 1 фаза', en: 'Power factor 1 phase'},
        'cosfPhase2':                           {ru: 'Коэффициент мощности 2 фаза', en: 'Power factor 2 phase'},
        'cosfPhase3':                           {ru: 'Коэффициент мощности 3 фаза', en: 'Power factor 3 phase'},
        'powerSTotal':                          {ru: 'Полная мощность итого', en: 'Apparent power total'},
        'powerSPhase1':                         {ru: 'Полная мощность 1 фаза', en: 'Full power 1-phase'},
        'powerSPhase2':                         {ru: 'Полная мощность 2 фаза', en: 'Full power 2-phase'},
        'powerSPhase3':                         {ru: 'Полная мощность 3 фаза', en: 'Full power 3-phase'},
        'powerQTotal':                          {ru: 'Реактивная мощность итого', en: 'Total reactive power'},
        'powerQPhase1':                         {ru: 'Реактивная мощность 1 фаза', en: 'Reactive power 1 phase'},
        'powerQPhase2':                         {ru: 'Реактивная мощность 2 фаза', en: 'Reactive power 2 phase'},
        'powerQPhase3':                         {ru: 'Реактивная мощность 3 фаза', en: 'Reactive power 3 phase'},
        'frequency':                            {ru: 'Частота сети', en: 'Mains frequency'},
        'temperature':                          {ru: 'Температура внутри прибора', en: 'The temperature inside the device'},
        'Location':                             {ru: 'Location', en: 'Location'},
        'Energy Class A+':                      {ru: 'Energy Class A+', en: 'Energy Class A+'},
        'Energy Class R+':                      {ru: 'Energy Class R+', en: 'Energy Class R+'},
        'Rated voltage':                        {ru: 'Rated voltage', en: 'Rated voltage'},
        'Rated current':                        {ru: 'Rated current', en: 'Rated current'},
        'Number of destinations':               {ru: 'Number of destinations', en: 'Number of destinations'},
        'Temperature Range':                    {ru: 'Temperature Range', en: 'Temperature Range'},
        'Medium Capacity Profile capacities':   {ru: 'Medium Capacity Profile capacities', en: 'Medium Capacity Profile capacities'},
        'Number of phases':                     {ru: 'Number of phases', en: 'Number of phases'},
        'Counter constant':                     {ru: 'Counter constant', en: 'Counter constant'},
        'Phase Summation':                      {ru: 'Phase Summation', en: 'Phase Summation'},
        'Tariff':                               {ru: 'Tariff', en: 'Tariff'},
        'Counter type':                         {ru: 'Counter type', en: 'Counter type'},
        'Execution option':                     {ru: 'Execution option', en: 'Execution option'},
        'Memory':                               {ru: 'Memory', en: 'Memory'},
        'Built-in PLM Modem':                   {ru: 'Built-in PLM Modem', en: 'Built-in PLM Modem'},
        'Built-in GSM Modem':                   {ru: 'Built-in GSM Modem', en: 'Built-in GSM Modem'},
        'Optical port':                         {ru: 'Optical port', en: 'Optical port'},
        'Interface type':                       {ru: 'Interface type', en: 'Interface type'},
        'External power':                       {ru: 'External power', en: 'External power'},
        'Top Seal Electronic Seal':             {ru: 'Top Seal Electronic Seal', en: 'Top Seal Electronic Seal'},
        'Built-in load shedding relay':         {ru: 'Built-in load shedding relay', en: 'Built-in load shedding relay'},
        'LCD backlight':                        {ru: 'LCD backlight', en: 'LCD backlight'},
        'Tariff metering of maximum power':     {ru: 'Tariff metering of maximum power', en: 'Tariff metering of maximum power'},
        'Electronic seal of protective cover':  {ru: 'Electronic seal of protective cover', en: 'Electronic seal of protective cover'},
        'Interface2':                           {ru: 'Interface2', en: 'Interface2'},
        'Built-in Power Interface1':            {ru: 'Built-in Power Interface1', en: 'Built-in Power Interface1'},
        'PCE control':                          {ru: 'PCE control', en: 'PCE control'},
        'Phase energy metering A+':             {ru: 'Phase energy metering A+', en: 'Phase energy metering A+'},
        'Integrated PLC2 Modem':                {ru: 'Integrated PLC2 Modem', en: 'Integrated PLC2 Modem'},
        'Profile2':                             {ru: 'Profile2', en: 'Profile2'},
        'Modular compartment electronic seal':  {ru: 'Modular compartment electronic seal', en: 'Modular compartment electronic seal'},
        'Tariff switching by external voltage': {ru: 'Tariff switching by external voltage', en: 'Tariff switching by external voltage'},
        'CRC16 software':                       {ru: 'CRC16 software', en: 'CRC16 software'},
        'Voltage transformation ratio':         {ru: 'Voltage transformation ratio', en: 'Voltage transformation ratio'},
        'Current transformer ratio':            {ru: 'Current transformer ratio', en: 'Current transformer ratio'}
    };
    if (word[w]){
        return word[w]['ru'];
    } else {
        event.emit('info', 'Пришлите эту строку с переводом разработчику - [ ' + '\'' + w + '\': {ru: \'' + 'ВАШ_ПЕРЕВОД\'' + ', en: \'' + 'YOUR_TRANSLATION\'}, ] ');
        return w;
    }
};

module.exports.template = {
    1: {
        conf:     {
            model:    {val: null, name: '', desc: 'model'},
            name:     {val: '', desc: 'name'},
            user:     {val: 1, desc: 'user'},
            addr:     {val: null, desc: 'address'},
            protocol: {val: null, desc: 'protocol'}
        },
        info:     {},
        metering: {
            EnergyMonth: {
                Current: {
                    T1:    {val: null, unit: 'kWh', desc: 'Энергия за текущий месяц по тарифу 1'},
                    T2:    {val: null, unit: 'kWh', desc: 'Энергия за текущий месяц по тарифу 2'},
                    T3:    {val: null, unit: 'kWh', desc: 'Энергия за текущий месяц по тарифу 3'},
                    T4:    {val: null, unit: 'kWh', desc: 'Энергия за текущий месяц по тарифу 4'},
                    Total: {val: null, unit: 'kWh', desc: 'Энергия за текущий месяц Итого'}
                }
            }
        }
    },
    2: {
        conf:     {
            model:      {val: null, name: '', desc: 'model'},
            name:       {val: '', desc: 'name'},
            addr:       {val: null, desc: 'address'},
            user:       {val: 1, desc: 'user'},
            pwd:        {val: null, desc: 'password'},
            protocol:   {val: null, desc: 'protocol'},
            isExtended: {val: false, desc: 'extended'}
        },
        info:     {},
        metering: {
            EnergyMonth: {
                Current: {
                    T1:    {val: null, unit: 'kWh', desc: 'Энергия за текущий месяц по тарифу 1'},
                    T2:    {val: null, unit: 'kWh', desc: 'Энергия за текущий месяц по тарифу 2'},
                    T3:    {val: null, unit: 'kWh', desc: 'Энергия за текущий месяц по тарифу 3'},
                    T4:    {val: null, unit: 'kWh', desc: 'Энергия за текущий месяц по тарифу 4'},
                    Total: {val: null, unit: 'kWh', desc: 'Энергия за текущий месяц Итого'}
                }
            }
        }
    }
};

function setDevState(device, index, param){
    const arr = param.name.split('.');
    const obj = {val: param.val, unit: param.unit ? param.unit :'', desc: param.desc ? param.desc :arr[arr.length - 1]};
    if (arr.length > 3) return device;
    for (let i = 0; i < arr.length; i++) {
        if (i === 0 && device[index][arr[0]] === undefined){
            device[index][arr[0]] = {};
            if (arr.length - 1 === i){
                device[index][arr[0]] = obj;
            }
        } else if (i === 0 && device[index][arr[0]].val !== undefined){
            device[index][arr[0]].val = param.val;
        }
        if (i === 1 && device[index][arr[0]][arr[1]] === undefined){
            device[index][arr[0]][arr[1]] = {};
            if (arr.length - 1 === i){
                device[index][arr[0]][arr[1]] = obj;
            }
        } else if (i === 1 && device[index][arr[0]][arr[1]].val !== undefined){
            device[index][arr[0]][arr[1]].val = param.val;
        }
        if (i === 2 && device[index][arr[0]][arr[1]][arr[2]] === undefined){
            device[index][arr[0]][arr[1]][arr[2]] = {};
            if (arr.length - 1 === i){
                device[index][arr[0]][arr[1]][arr[2]] = obj;
            }
        } else if (i === 2 && device[index][arr[0]][arr[1]][arr[2]].val !== undefined){
            device[index][arr[0]][arr[1]][arr[2]].val = param.val;
        }
    }
    //event.emit('debug', 'device: ' + JSON.stringify(device));
    return device;
}

//******* Для 1 фазных счетчиков ********//
const ff = {
    readSN:           function (device, index, cmd, response){
        event.emit('debug', 'readSN - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            setDevState(device, index, {
                name: 'info.sn',
                desc: translate('Serial number'),
                val:  response.readUInt32BE(5)
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    dateProd:         function (device, index, cmd, response){
        event.emit('debug', 'dateProd - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            setDevState(device, index, {
                name: 'info.dateProd',
                desc: translate('Production date'),
                val:  parseDate(response[5], response[6], response[7])
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    identCounter:     function (device, index, cmd, response){
        event.emit('debug', 'identCounter - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            setDevState(device, index, {
                name: 'info.firmware',
                desc: translate('Software version'),
                val:  response[5].toString(16) + '.' + response[6].toString(16)
            });
            setDevState(device, index, {
                name: 'info.firmwareDate',
                desc: translate('firmware date'),  //Дата версии прошивки
                val:  parseDate(response[8], response[9], response[10])
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    optronFunc:       function (device, index, cmd, response){
        event.emit('debug', 'optronFunc - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            const vars = {
                0: '5000 imp/kW',
                1: '10000 imp/kW',
                2: 'freq quartz/8',
                3: 'load control'
            };
            setDevState(device, index, {
                name: 'info.ir',
                desc: translate('Optical port'),
                val:  vars[parseInt(response[5])]
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    variantExecution: function (device, index, cmd, response){
        event.emit('debug', 'variantExecution - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            setDevState(device, index, {
                name: 'info.twoCurrentSensors',
                desc: translate('twoCurrentSensors'),
                val:  response[5] > 0
            });
            setDevState(device, index, {
                name: 'info.internalRele',
                desc: translate('internalRele'),
                val:  response[6] > 0
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    batteryVolt:      function (device, index, cmd, response){
        event.emit('debug', 'batteryVolt - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            setDevState(device, index, {
                name: 'metering.battery',
                desc: translate('battery'),
                unit: 'V',
                val:  response[5] + '.' + zeroConcat(response[6])
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    totalEnergy:      function (device, index, cmd, response){
        event.emit('debug', 'totalEnergy - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            const {t1, t2, t3, t4} = parseEnergy(response, 100);
            setDevState(device, index, {
                name: 'metering.Total.T1',
                desc: translate('oneTarrifEnergyActive'),
                unit: 'kWh',
                val:  t1
            });
            setDevState(device, index, {
                name: 'metering.Total.T2',
                desc: translate('twoTarrifEnergyActive'),
                unit: 'kWh',
                val:  t2
            });
            setDevState(device, index, {
                name: 'metering.Total.T3',
                desc: translate('threeTarrifEnergyActive'),
                unit: 'kWh',
                val:  t3
            });
            setDevState(device, index, {
                name: 'metering.Total.T4',
                desc: translate('fourTarrifEnergyActive'),
                unit: 'kWh',
                val:  t4
            });
            setDevState(device, index, {
                name: 'metering.Total.Total',
                desc: translate('TotalEnergyActive'),
                unit: 'kWh',
                val:  +(t1 + t2 + t3 + t4).toFixed(2)
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    readUIP:          function (device, index, cmd, response){
        event.emit('debug', 'readUIP - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            const u = parseInt(response[5].toString(16) + zeroConcat(response[6].toString(16)));
            const i = parseInt(response[7].toString(16) + zeroConcat(response[8]));
            const p = parseInt(response[9].toString(16) + zeroConcat(response[10]) + zeroConcat(response[11]));
            setDevState(device, index, {
                name: 'metering.MainsParameters.voltage',
                desc: translate('voltage'),
                unit: 'V',
                val:  u > 999 ? u / 10 :u
            });
            setDevState(device, index, {
                name: 'metering.MainsParameters.current',
                desc: translate('current'),
                unit: 'A',
                val:  i / 100
            });
            setDevState(device, index, {
                name: 'metering.MainsParameters.power',
                desc: translate('power'),
                unit: 'W',
                val:  p// / 1000
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    voltageOff:       function (device, index, cmd, response){
        event.emit('debug', 'voltageOff - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            let date = parseDate(response[9], response[10], response[11]);
            date += ' ' + parseTime(response[6], response[7], response[8]);
            setDevState(device, index, {
                name: 'metering.voltageOff',
                desc: translate('voltageOff'),
                val:  date
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    voltageOn:        function (device, index, cmd, response){
        event.emit('debug', 'voltageOn - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            let date = parseDate(response[9], response[10], response[11]);
            date += ' ' + parseTime(response[6], response[7], response[8]);
            setDevState(device, index, {
                name: 'metering.voltageOn',
                desc: translate('voltageOn'),
                val:  date
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    readDateTime:     function (device, index, cmd, response){
        event.emit('debug', 'readDateTime - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            let date = parseDate(response[9], response[10], response[11]);
            date += ' ' + parseTime(response[6], response[7], response[8]);
            setDevState(device, index, {
                name: 'metering.DateTime',
                desc: translate('DateTime'),
                val:  date
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    limitPower:       function (device, index, cmd, response){
        event.emit('debug', 'limitPower - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            setDevState(device, index, {
                name: 'metering.limitPower',
                desc: translate('limitPower'),
                unit: 'kW',
                val:  response[5].toString(16) + '.' + response[6].toString(16)
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    limitEnergyMonth: function (device, index, cmd, response){
        event.emit('debug', 'limitEnergyMonth - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            setDevState(device, index, {
                name: 'metering.limitEnergyMonth',
                desc: translate('limitEnergyMonth'),
                unit: 'kWh',
                val:  parseInt(response[5].toString(16) + response[6].toString(16))
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    /*currentPower:     function (device, index, cmd, response){
        event.emit('debug','currentPower - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        //[0,14,31,155,38,0,65,129,51]
        event.emit('debug','*************************' + response[5].toString(16) + '.' + zeroConcat(response[6]));
        try {
            setDevState(device, index, {
                name: 'metering.MainsParameters.currentPower',
                desc: translate('currentPower'),
                unit: 'kW',
                val:  response[5].toString(16) + '.' + zeroConcat(response[6])
            });
        } catch (e) {
            event.emit('debug',e);
        }
        return device;
    },*/
    month12Energy:    function (device, index, cmd, response){
        event.emit('debug', 'month12Energy -  cmd: ' + JSON.stringify(cmd) + ' index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            const month = parseInt(cmd[5]) + 1;
            if (month !== 16 && device[index].metering.EnergyMonth[month] === undefined){
                device[index].metering.EnergyMonth[month] = {
                    T1:    {val: null, unit: 'kWh', desc: translate('oneTarrifEnergy')},
                    T2:    {val: null, unit: 'kWh', desc: translate('twoTarrifEnergy')},
                    T3:    {val: null, unit: 'kWh', desc: translate('threeTarrifEnergy')},
                    T4:    {val: null, unit: 'kWh', desc: translate('fourTarrifEnergy')},
                    Total: {val: null, unit: 'kWh', desc: translate('TotalEnergy')}
                };
            }
            let {t1, t2, t3, t4} = parseEnergy(response, 100);
            t1 = Number.isFinite(t1) ? t1 :0;
            t2 = Number.isFinite(t2) ? t2 :0;
            t3 = Number.isFinite(t3) ? t3 :0;
            t4 = Number.isFinite(t4) ? t4 :0;
            let ttl = +(t1 + t2 + t3 + t4).toFixed(2);
            if (ttl > -5 && ttl < 0) ttl = 0;
            if (month !== 16){
                device[index].metering.EnergyMonth[month].T1.val = t1;
                device[index].metering.EnergyMonth[month].T2.val = t2;
                device[index].metering.EnergyMonth[month].T3.val = t3;
                device[index].metering.EnergyMonth[month].T4.val = t4;
                device[index].metering.EnergyMonth[month].Total.val = ttl;
            } else if (month === 16){
                device[index].metering.EnergyMonth.Current.T1.val = t1;
                device[index].metering.EnergyMonth.Current.T2.val = t2;
                device[index].metering.EnergyMonth.Current.T3.val = t3;
                device[index].metering.EnergyMonth.Current.T4.val = t4;
                device[index].metering.EnergyMonth.Current.Total.val = ttl;
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    readMaxU:         function (device, index, cmd, response){
        event.emit('debug', 'readMaxU - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            //V-hh-mm-ss-dd-mon-yy
            //I-hh-mm-ss-dd-mon-yy
            //m-hh-mm-ss-dd-mon-yy
            /*setDevState(device, index, {
                name: 'metering.MaxreadMaxU',
                desc: translate('readMaxU'),
                val:  response[5].toString(16) + '.' + response[6].toString(16)
            });*/
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    readDay:          function (device, index, cmd, response){
        event.emit('debug', 'readMaxU - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            /*setDevState(device, index, {
                name: 'metering.MaxreadMaxU',
                desc: translate('readMaxU'),
                val:  response[5].toString(16) + '.' + response[6].toString(16)
            });*/
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    runningTime:      function (device, index, cmd, response){
        event.emit('debug', 'runningTime - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            //ADDR-CMD-DATA24 -CRC
            /*setDevState(device, index, {
                name: 'metering.runningTime.On',
                desc: translate('readMaxU'),
                val:  response[5].toString(16) + '.' + response[6].toString(16)
            });*/
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    readFreq:         function (device, index, cmd, response){
        event.emit('debug', 'readFreq - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            const hz = parseInt(response[5].toString(16) + zeroConcat(response[6].toString(16)));
            setDevState(device, index, {
                name: 'metering.MainsParameters.frequency',
                desc: translate('frequency'),
                unit: 'Hz',
                val:  hz / 100
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    readParams0:      function (device, index, cmd, response){
        event.emit('debug', 'readParams0 - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try { //[2,145,154,168,134,  0,0,1,114,  240,186]
            const pq = parseInt(response[6].toString(16) + zeroConcat(response[7]) + zeroConcat(response[8]));
            setDevState(device, index, {
                name: 'metering.MainsParameters.powerQTotal',
                desc: translate('powerQTotal'),
                unit: 'var',
                val:  pq
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    readParams2:      function (device, index, cmd, response){
        event.emit('debug', 'readParams2 - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            const znak = (7 >> response[6]) & 1;
            response[6] &= ~(1 << 1);
            const cosf = parseInt(response[6].toString(16) + zeroConcat(response[7])) / 1000;
            const p = parseInt(response[8].toString(16) + zeroConcat(response[9]) + zeroConcat(response[10]));
            setDevState(device, index, {
                name: 'metering.MainsParameters.cosfTotal',
                desc: translate('cosfTotal'),
                val:  znak ? cosf :cosf * (-1)
            });
            setDevState(device, index, {
                name: 'metering.MainsParameters.powerSTotal',
                desc: translate('powerSTotal'),
                unit: 'VA',
                val:  p
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
};

//******* Для 3 фазных счетчиков ********//
const f = {
    readSnAndDate:    function (device, index, cmd, response){
        event.emit('debug', 'readSnAndDate - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            setDevState(device, index, {
                name: 'info.sn',
                desc: translate('Serial number'),
                val:  parseInt(response.slice(1, 5).join(''))
            });
            setDevState(device, index, {
                name: 'info.dateProd',
                desc: translate('Production date'),
                val:  (parseInt(response[5]) < 10 ? '0' :'') + response[5] + '.' + (parseInt(response[6]) < 10 ? '0' :'') + response[6] + '.' + '20' + response[7]
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    firmwareVersion:  function (device, index, cmd, response){
        event.emit('debug', 'firmwareVersion - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            setDevState(device, index, {
                name: 'info.firmware',
                desc: translate('Software version'),
                val:  response.slice(1, 4).join('.')
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    crcDevice:        function (device, index, cmd, response){
        event.emit('debug', 'crcDevice - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            setDevState(device, index, {
                name: 'info.crcDevice',
                desc: translate('CRC16 software'),
                val:  response.slice(1, 3).toString('hex').toUpperCase()
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    variantExecution: function (device, index, cmd, response){
        event.emit('debug', 'variantExecution - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            //1
            setDevState(device, index, {
                name: 'info.classEnergyA',
                desc: translate('Energy Class A+'),
                val:  getVariant(1, 4, (response[1] >> 6) & 3)
            });
            setDevState(device, index, {
                name: 'info.classEnergyR',
                desc: translate('Energy Class R+'),
                val:  getVariant(1, 3, (response[1] >> 4) & 3)
            });
            setDevState(device, index, {
                name: 'info.nomU',
                desc: translate('Rated voltage'),
                val:  getVariant(1, 2, (response[1] >> 2) & 3)
            });
            setDevState(device, index, {
                name: 'info.nomI',
                desc: translate('Rated current'),
                val:  getVariant(1, 1, (response[1] >> 0) & 3)
            });
            //2
            setDevState(device, index, {
                name: 'info.dest',
                desc: translate('Number of destinations'),
                val:  getVariant(2, 5, (response[2] >> 7) & 1)
            });
            setDevState(device, index, {
                name: 'info.temperature',
                desc: translate('Temperature Range'),
                val:  getVariant(2, 4, (response[2] >> 6) & 1)
            });
            setDevState(device, index, {
                name: 'info.mediumPowerProfile',
                desc: translate('Medium Capacity Profile capacities'),
                val:  getVariant(2, 3, (response[2] >> 5) & 1)
            });
            setDevState(device, index, {
                name: 'info.numPhases',
                desc: translate('Number of phases'),
                val:  getVariant(2, 2, (response[2] >> 4) & 1)
            });
            setDevState(device, index, {
                name: 'info.counterConst',
                desc: translate('Counter constant'),
                val:  getVariant(2, 1, (response[2] >> 0) & 15)
            });
            //3
            setDevState(device, index, {
                name: 'info.SummPhases',
                desc: translate('Phase Summation'),
                val:  getVariant(3, 4, (response[3] >> 7) & 1)
            });
            setDevState(device, index, {
                name: 'info.Tarifficator',
                desc: translate('Tariff'),
                val:  getVariant(3, 3, (response[3] >> 6) & 1)
            });
            setDevState(device, index, {
                name: 'info.typeCount',
                desc: translate('Counter type'),
                val:  getVariant(3, 2, (response[3] >> 4) & 3)
            });
            setDevState(device, index, {
                name: 'info.executionOption',
                desc: translate('Execution option'),
                val:  parseInt((response[3] >> 0) & 15)
            });
            //4
            setDevState(device, index, {
                name: 'info.memSize',
                desc: translate('Memory'),
                val:  getVariant(4, 7, (response[4] >> 7) & 1)
            });
            setDevState(device, index, {
                name: 'info.intPlm',
                desc: translate('Built-in PLM Modem'),
                val:  getVariant(4, 6, (response[4] >> 6) & 1)
            });
            setDevState(device, index, {
                name: 'info.intGsm',
                desc: translate('Built-in GSM Modem'),
                val:  getVariant(4, 5, (response[4] >> 5) & 1)
            });
            setDevState(device, index, {
                name: 'info.ir',
                desc: translate('Optical port'),
                val:  getVariant(4, 4, (response[4] >> 4) & 1)
            });
            setDevState(device, index, {
                name: 'info.interface',
                desc: translate('Interface type'),
                val:  getVariant(4, 3, (response[4] >> 2) & 3)
            });
            setDevState(device, index, {
                name: 'info.extPower',
                desc: translate('External power'),
                val:  getVariant(4, 2, (response[4] >> 1) & 1)
            });
            setDevState(device, index, {
                name: 'info.elecSealTopCover',
                desc: translate('Top Seal Electronic Seal'),
                val:  getVariant(4, 1, (response[4] >> 0) & 1)
            });
            //5
            setDevState(device, index, {
                name: 'info.internalRelay',
                desc: translate('Built-in load shedding relay'),
                val:  getVariant(5, 8, (response[5] >> 7) & 1)
            });
            setDevState(device, index, {
                name: 'info.backlightDisp',
                desc: translate('LCD backlight'),
                val:  getVariant(5, 7, (response[5] >> 7) & 1)
            });
            setDevState(device, index, {
                name: 'info.tariffMeteringOfMaxPower',
                desc: translate('Tariff metering of maximum power'),
                val:  getVariant(6, 5, (response[5] >> 7) & 1)
            });
            setDevState(device, index, {
                name: 'info.elecSealCover',
                desc: translate('Electronic seal of protective cover'),
                val:  getVariant(5, 5, (response[5] >> 7) & 1)
            });
            setDevState(device, index, {
                name: 'info.interface2',
                desc: translate('Interface2'),
                val:  getVariant(5, 4, (response[5] >> 7) & 1)
            });
            setDevState(device, index, {
                name: 'info.intPower',
                desc: translate('Built-in Power Interface1'),
                val:  getVariant(5, 3, (response[5] >> 7) & 1)
            });
            setDevState(device, index, {
                name: 'info.controlPke',
                desc: translate('PCE control'),
                val:  getVariant(5, 2, (response[5] >> 7) & 1)
            });
            setDevState(device, index, {
                name: 'info.phaseMeteringEnergyA',
                desc: translate('Phase energy metering A+'),
                val:  getVariant(5, 1, (response[5] >> 7) & 1)
            });
            //6
            setDevState(device, index, {
                name: 'info.internalPlc2',
                desc: translate('Integrated PLC2 Modem'),
                val:  getVariant(6, 5, (response[6] >> 4) & 1)
            });
            setDevState(device, index, {
                name: 'info.profile2',
                desc: translate('Profile2'),
                val:  getVariant(6, 4, (response[6] >> 3) & 1)
            });
            setDevState(device, index, {
                name: 'info.electronicSealModuleBay',
                desc: translate('Modular compartment electronic seal'),
                val:  getVariant(6, 3, (response[6] >> 2) & 1)
            });
            setDevState(device, index, {
                name: 'info.externalVoltageTariffSwitch',
                desc: translate('Tariff switching by external voltage'),
                val:  getVariant(6, 2, (response[6] >> 1) & 1)
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    readLocation:     function (device, index, cmd, response){
        event.emit('debug', 'readLocation - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            setDevState(device, index, {
                name: 'info.location',
                desc: translate('Location'),
                val:  response.toString('ascii', 1, 5)
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    transformRatio:   function (device, index, cmd, response){
        event.emit('debug', 'transformRatio - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            setDevState(device, index, {
                name: 'info.voltageTransformationRatio',
                desc: translate('Voltage transformation ratio'),
                val:  response.readInt16BE(1)
            });
            setDevState(device, index, {
                name: 'info.currentTransformationRatio',
                desc: translate('Current transformer ratio'),
                val:  response.readInt16BE(3)
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    totalEnergy:      function (device, index, cmd, response){
        event.emit('debug', 'totalEnergy - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 19){
                const {one, two, three, four} = getFour32LE(response, 1000);
                setDevState(device, index, {
                    name: 'metering.Total.totalEnergyActivePlus',
                    desc: translate('totalEnergyActivePlus'),
                    unit: 'kWh',
                    val:  one
                });
                setDevState(device, index, {
                    name: 'metering.Total.totalEnergyActiveMinus',
                    desc: translate('totalEnergyActiveMinus'),
                    unit: 'kWh',
                    val:  two
                });
                setDevState(device, index, {
                    name: 'metering.Total.totalEnergyReactivePlus',
                    desc: translate('totalEnergyReactivePlus'),
                    unit: 'kvar',
                    val:  three
                });
                setDevState(device, index, {
                    name: 'metering.Total.totalEnergyReactiveMinus',
                    desc: translate('totalEnergyReactiveMinus'),
                    unit: 'kvar',
                    val:  four
                });
                /*setDevState(device, index, {
                    name: 'metering.Total.totalEnergy',
                    desc: translate('totalEnergy'),
                    unit: 'kWh',
                    val:  parseFloat((one + two + three + four).toFixed(2))
                });*/
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    currentDayEnergy: function (device, index, cmd, response){
        event.emit('debug', 'currentDayEnergy - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 19){
                const {one, two, three, four} = getFour32LE(response, 1000);
                setDevState(device, index, {
                    name: 'metering.Day.TotalEnergyActivePlus',
                    desc: translate('currentDayTotalEnergyActivePlus'),
                    unit: 'kWh',
                    val:  one
                });
                setDevState(device, index, {
                    name: 'metering.Day.TotalEnergyActiveMinus',
                    desc: translate('currentDayTotalEnergyActiveMinus'),
                    unit: 'kWh',
                    val:  two
                });
                setDevState(device, index, {
                    name: 'metering.Day.TotalEnergyReactivePlus',
                    desc: translate('currentDayTotalEnergyReactivePlus'),
                    unit: 'kvar',
                    val:  three
                });
                setDevState(device, index, {
                    name: 'metering.Day.TotalEnergyReactiveMinus',
                    desc: translate('currentDayTotalEnergyReactiveMinus'),
                    unit: 'kvar',
                    val:  four
                });
                /*setDevState(device, index, {
                    name: 'metering.Day.EnergyTotal',
                    desc: translate('currentDayEnergyTotal'),
                    unit: 'kWh',
                    val:  parseFloat((one + two + three + four).toFixed(2))
                });*/
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    oneTarrif:        function (device, index, cmd, response){
        event.emit('debug', 'oneTarrif - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 19){
                const {one, two, three, four} = getFour32LE(response, 1000);
                setDevState(device, index, {
                    name: 'metering.Total.oneTarrifEnergyActivePlus',
                    desc: translate('oneTarrifEnergyActivePlus'),
                    unit: 'kWh',
                    val:  one
                });
                setDevState(device, index, {
                    name: 'metering.Total.oneTarrifEnergyActiveMinus',
                    desc: translate('oneTarrifEnergyActiveMinus'),
                    unit: 'kWh',
                    val:  two
                });
                setDevState(device, index, {
                    name: 'metering.Total.oneTarrifEnergyReactivePlus',
                    desc: translate('oneTarrifEnergyReactivePlus'),
                    unit: 'kvar',
                    val:  three
                });
                setDevState(device, index, {
                    name: 'metering.Total.oneTarrifEnergyReactiveMinus',
                    desc: translate('oneTarrifEnergyReactiveMinus'),
                    unit: 'kvar',
                    val:  four
                });
                /*setDevState(device, index, {
                    name: 'metering.Total.oneTarrifEnergyTotal',
                    desc: translate('oneTarrifEnergyTotal'),
                    unit: 'kWh',
                    val:  parseFloat((one + two + three + four).toFixed(2))
                });*/
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    twoTarrif:        function (device, index, cmd, response){
        event.emit('debug', 'twoTarrif - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 19){
                const {one, two, three, four} = getFour32LE(response, 1000);
                setDevState(device, index, {
                    name: 'metering.Total.twoTarrifEnergyActivePlus',
                    desc: translate('twoTarrifEnergyActivePlus'),
                    unit: 'kWh',
                    val:  one
                });
                setDevState(device, index, {
                    name: 'metering.Total.twoTarrifEnergyActiveMinus',
                    desc: translate('twoTarrifEnergyActiveMinus'),
                    unit: 'kWh',
                    val:  two
                });
                setDevState(device, index, {
                    name: 'metering.Total.twoTarrifEnergyReactivePlus',
                    desc: translate('twoTarrifEnergyReactivePlus'),
                    unit: 'kvar',
                    val:  three
                });
                setDevState(device, index, {
                    name: 'metering.Total.twoTarrifEnergyReactiveMinus',
                    desc: translate('twoTarrifEnergyReactiveMinus'),
                    unit: 'kvar',
                    val:  four
                });
                /*setDevState(device, index, {
                    name: 'metering.Total.twoTarrifEnergyTotal',
                    desc: translate('twoTarrifEnergyTotal'),
                    unit: 'kWh',
                    val:  parseFloat((one + two + three + four).toFixed(2))
                });*/
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    threeTarrif:      function (device, index, cmd, response){
        event.emit('debug', 'threeTarrif - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 19){
                const {one, two, three, four} = getFour32LE(response, 1000);
                setDevState(device, index, {
                    name: 'metering.Total.threeTarrifEnergyActivePlus',
                    desc: translate('threeTarrifEnergyActivePlus'),
                    unit: 'kWh',
                    val:  one
                });
                setDevState(device, index, {
                    name: 'metering.Total.threeTarrifEnergyActiveMinus',
                    desc: translate('threeTarrifEnergyActiveMinus'),
                    unit: 'kWh',
                    val:  two
                });
                setDevState(device, index, {
                    name: 'metering.Total.threeTarrifEnergyReactivePlus',
                    desc: translate('threeTarrifEnergyReactivePlus'),
                    unit: 'kvar',
                    val:  three
                });
                setDevState(device, index, {
                    name: 'metering.Total.threeTarrifEnergyReactiveMinus',
                    desc: translate('threeTarrifEnergyReactiveMinus'),
                    unit: 'kvar',
                    val:  four
                });
                /*setDevState(device, index, {
                    name: 'metering.Total.threeTarrifEnergyTotal',
                    desc: translate('threeTarrifEnergyTotal'),
                    unit: 'kWh',
                    val:  parseFloat((one + two + three + four).toFixed(2))
                });*/
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    fourTarrif:       function (device, index, cmd, response){
        event.emit('debug', 'fourTarrif - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 19){
                const {one, two, three, four} = getFour32LE(response, 1000);
                setDevState(device, index, {
                    name: 'metering.Total.fourTarrifEnergyActivePlus',
                    desc: translate('fourTarrifEnergyActivePlus'),
                    unit: 'kWh',
                    val:  one
                });
                setDevState(device, index, {
                    name: 'metering.Total.fourTarrifEnergyActiveMinus',
                    desc: translate('fourTarrifEnergyActiveMinus'),
                    unit: 'kWh',
                    val:  two
                });
                setDevState(device, index, {
                    name: 'metering.Total.fourTarrifEnergyReactivePlus',
                    desc: translate('fourTarrifEnergyReactivePlus'),
                    unit: 'kvar',
                    val:  three
                });
                setDevState(device, index, {
                    name: 'metering.Total.fourTarrifEnergyReactiveMinus',
                    desc: translate('fourTarrifEnergyReactiveMinus'),
                    unit: 'kvar',
                    val:  four
                });
                /*setDevState(device, index, {
                    name: 'metering.Total.fourTarrifEnergyTotal',
                    desc: translate('fourTarrifEnergyTotal'),
                    unit: 'kWh',
                    val:  parseFloat((one + two + three + four).toFixed(2))
                });*/
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    powerPhaseP:      function (device, index, cmd, response){
        event.emit('debug', 'powerPhaseP - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 15){
                const {one, two, three, four} = getPowerFour32LE(response, 100);
                event.emit('debug', 'powerPhaseP - powerTotal: ' + one + ' powerPhase1: ' + two + ' powerPhase2: ' + three + ' powerPhase3: ' + four);
                setDevState(device, index, {name: 'metering.MainsParameters.powerTotal', unit: 'W', desc: translate('powerTotal'), val: one});
                setDevState(device, index, {name: 'metering.MainsParameters.powerPhase1', unit: 'W', desc: translate('powerPhase1'), val: two});
                setDevState(device, index, {name: 'metering.MainsParameters.powerPhase2', unit: 'W', desc: translate('powerPhase2'), val: three});
                setDevState(device, index, {name: 'metering.MainsParameters.powerPhase3', unit: 'W', desc: translate('powerPhase3'), val: four});
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    powerPhaseS:      function (device, index, cmd, response){
        event.emit('debug', 'powerPhaseS - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 15){
                const {one, two, three, four} = getPowerFour32LE(response, 100);
                event.emit('debug', 'powerPhaseS - powerSTotal: ' + one + ' powerSPhase1: ' + two + ' powerSPhase2: ' + three + ' powerSPhase3: ' + four);
                setDevState(device, index, {name: 'metering.MainsParameters.powerSTotal', unit: 'VA', desc: translate('powerSTotal'), val: one});
                setDevState(device, index, {name: 'metering.MainsParameters.powerSPhase1', unit: 'VA', desc: translate('powerSPhase1'), val: two});
                setDevState(device, index, {name: 'metering.MainsParameters.powerSPhase2', unit: 'VA', desc: translate('powerSPhase2'), val: three});
                setDevState(device, index, {name: 'metering.MainsParameters.powerSPhase3', unit: 'VA', desc: translate('powerSPhase3'), val: four});
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    powerPhaseQ:      function (device, index, cmd, response){
        event.emit('debug', 'powerPhaseQ - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 15){
                const {one, two, three, four} = getPowerFour32LE(response, 100);
                event.emit('debug', 'powerPhaseQ - powerQTotal: ' + one + ' powerQPhase1: ' + two + ' powerQPhase2: ' + three + ' powerQPhase3: ' + four);
                setDevState(device, index, {name: 'metering.MainsParameters.powerQTotal', unit: 'var', desc: translate('powerQTotal'), val: one});
                setDevState(device, index, {name: 'metering.MainsParameters.powerQPhase1', unit: 'var', desc: translate('powerQPhase1'), val: two});
                setDevState(device, index, {name: 'metering.MainsParameters.powerQPhase2', unit: 'var', desc: translate('powerQPhase2'), val: three});
                setDevState(device, index, {name: 'metering.MainsParameters.powerQPhase3', unit: 'var', desc: translate('powerQPhase3'), val: four});
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    voltagePhase:     function (device, index, cmd, response){
        event.emit('debug', 'voltagePhase - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 12){
                const {one, two, three} = getThree16LE(response, 100);
                event.emit('debug', 'voltagePhase - one: ' + one + ' two: ' + two + ' three: ' + three);
                setDevState(device, index, {
                    name: 'metering.MainsParameters.voltagePhase1',
                    desc: translate('voltagePhase1'),
                    unit: 'V',
                    val:  one
                });
                setDevState(device, index, {
                    name: 'metering.MainsParameters.voltagePhase2',
                    desc: translate('voltagePhase2'),
                    unit: 'V',
                    val:  two
                });
                setDevState(device, index, {
                    name: 'metering.MainsParameters.voltagePhase3',
                    desc: translate('voltagePhase3'),
                    unit: 'V',
                    val:  three
                });
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    currentPhase:     function (device, index, cmd, response){
        event.emit('debug', 'currentPhase - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 12){
                const {one, two, three} = getThree16LE(response, 1000);
                event.emit('debug', 'currentPhase - one: ' + one + ' two: ' + two + ' three: ' + three);
                setDevState(device, index, {
                    name: 'metering.MainsParameters.currentPhase1',
                    desc: translate('currentPhase1'),
                    unit: 'A',
                    val:  one
                });
                setDevState(device, index, {
                    name: 'metering.MainsParameters.currentPhase2',
                    desc: translate('currentPhase2'),
                    unit: 'A',
                    val:  two
                });
                setDevState(device, index, {
                    name: 'metering.MainsParameters.currentPhase3',
                    desc: translate('currentPhase3'),
                    unit: 'A',
                    val:  three
                });
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    cosf:             function (device, index, cmd, response){
        event.emit('debug', 'cosf - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 15){
                const {one, two, three, four} = getFour16LE(response, 1000);
                event.emit('debug', 'cosf - cosfTotal: ' + one + ' cosfPhase1: ' + two + ' cosfPhase2: ' + three + ' cosfPhase3: ' + four);
                setDevState(device, index, {name: 'metering.MainsParameters.cosfTotal', desc: translate('cosfTotal'), val: one});
                setDevState(device, index, {name: 'metering.MainsParameters.cosfPhase1', desc: translate('cosfPhase1'), val: two});
                setDevState(device, index, {name: 'metering.MainsParameters.cosfPhase2', desc: translate('cosfPhase2'), val: three});
                setDevState(device, index, {name: 'metering.MainsParameters.cosfPhase3', desc: translate('cosfPhase3'), val: four});
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    freq:             function (device, index, cmd, response){
        event.emit('debug', 'freq - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 6){
                const one = parseFloat(((Buffer.from([0, 0, response[3], response[2]]).readInt32BE(0)) / 100).toFixed(2));
                event.emit('debug', 'freq: ' + one);
                setDevState(device, index, {name: 'metering.MainsParameters.frequency', unit: 'Hz', desc: translate('frequency'), val: one});
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    intemp:           function (device, index, cmd, response){
        event.emit('debug', 'intemp - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 5){
                const one = parseInt(response[1] + response[2]);
                event.emit('debug', 'intemp: ' + one);
                setDevState(device, index, {name: 'metering.MainsParameters.temperature', unit: '°C', desc: translate('temperature'), val: one});
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    yearEnergy:       function (device, index, cmd, response){
        event.emit('debug', 'yearEnergy - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 19){
                const {one, two, three, four} = getFour32LE(response, 1000);
                setDevState(device, index, {
                    name: 'metering.Year.TotalEnergyActivePlus',
                    desc: translate('currentYearTotalEnergyActivePlus'),
                    unit: 'kWh',
                    val:  one
                });
                setDevState(device, index, {
                    name: 'metering.Year.TotalEnergyActiveMinus',
                    desc: translate('currentYearTotalEnergyActiveMinus'),
                    unit: 'kWh',
                    val:  two
                });
                setDevState(device, index, {
                    name: 'metering.Year.TotalEnergyReactivePlus',
                    desc: translate('currentYearTotalEnergyReactivePlus'),
                    unit: 'kvar',
                    val:  three
                });
                setDevState(device, index, {
                    name: 'metering.Year.TotalEnergyReactiveMinus',
                    desc: translate('currentYearTotalEnergyReactiveMinus'),
                    unit: 'kvar',
                    val:  four
                });
                /*setDevState(device, index, {
                    name: 'metering.Year.EnergyTotal',
                    desc: translate('currentYearEnergyTotal'),
                    unit: 'kWh',
                    val:  parseFloat((one + two + three + four).toFixed(2))
                });*/
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    month12Energy:    function (device, index, cmd, response){
        event.emit('debug', 'monthEnergy - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 19){
                const month = ('0' + (parseInt(cmd[2] - 0x30, 10))).slice(-2);
                if (device[index].metering.EnergyMonth[month] === undefined){
                    device[index].metering.EnergyMonth[month] = {
                        T1:    {val: null, unit: 'kWh', desc: translate('oneTarrifEnergy')},
                        T2:    {val: null, unit: 'kWh', desc: translate('twoTarrifEnergy')},
                        T3:    {val: null, unit: 'kWh', desc: translate('threeTarrifEnergy')},
                        T4:    {val: null, unit: 'kWh', desc: translate('fourTarrifEnergy')},
                        Total: {val: null, unit: 'kWh', desc: translate('TotalEnergy')}
                    };
                }
                const {one, two, three, four} = getFour32LE(response, 1000);
                //let ttl = parseFloat((one + two + three + four).toFixed(2));
                let ttl = parseFloat((one).toFixed(2));
                let trf;
                if (ttl > -5 && ttl < 0) ttl = 0;
                if (cmd[3] === 0){
                    device[index].metering.EnergyMonth[month].Total.val = ttl;
                } else {
                    trf = 'T' + cmd[3].toString();
                    device[index].metering.EnergyMonth[month][trf].val = ttl;
                }
                if (month === getMonth()){
                    if (cmd[3] === 0){
                        device[index].metering.EnergyMonth.Current.Total.val = ttl;
                    } else {
                        trf = 'T' + cmd[3].toString();
                        device[index].metering.EnergyMonth.Current[trf].val = ttl;
                    }
                }
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    acceleratedMode:  function (device, index, cmd, response){
        event.emit('debug', 'acceleratedMode - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response));
    },
    readCurrentTime:  function (device, index, cmd, response){
        event.emit('debug', 'readCurrentTime - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            let date = parseDate(response[5], response[6], response[7]); //parseDate(dd, mm, yy)
            date += ' ' + parseTime(response[3], response[2], response[1]); //parseTime(hh, mm, ss)
            setDevState(device, index, {
                name: 'metering.DateTime',
                desc: translate('DateTime'),
                val:  date
            });
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    },
    statusByte:       function (device, index, cmd, response){
        event.emit('debug', 'statusByte - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' length: ' + response.length);
        try {
            if (response.length === 9){
                //* statusByte - index: 0 response: {"type":"Buffer","data":[203,18,5,7,36,5,22,0,0,0,0,2,0,157,208]} length: 15
                //[28,    0,0,0,0,0,0,  198,193]
                //[28,  88,89,35,49,8,24,  0,64,0,0,0,0,  18,169]
                /*
                Ответ: 80 44 24 11 25 01 08 00 00 00 00 02 00 (CRC), где:
                − «44 24 11 25 01 08» – время перепрограммирования: 11:24:44 25 января 2008 года;
                − «00 00 00 00 02 00» – позиционный код слова состояния – 02h = 00000010b, что соответствует «E2» – «Нарушение функционирования памяти №2».  
                 */
                /*let status;
                if(response[6] > 0){
                    //response.slice(1, 3).toString('hex').toUpperCase()
                    status = statusByte[response[6]];
                }
                setDevState(device, index, {
                    name: 'metering.StatusByte', 
                    desc: translate('Status Byte'), 
                    val: status
                });*/
            }
        } catch (e) {
            event.emit('debug', e);
        }
        return device;
    }
};

const options = {
    protocol: {
        1: {
            readinfo: [ //чтение инфы о счетчике
                {code: 0x2f, cmd: [], desc: 'Чтение серийного номера', func: ff.readSN},
                {code: 0x28, cmd: [], desc: 'Чтение версии и даты ПО', func: ff.identCounter},
                {code: 0x2d, cmd: [], desc: 'Чтение функции выходного оптрона', func: ff.optronFunc},
                {code: 0x65, cmd: [], desc: 'Чтение слова исполнения', func: ff.variantExecution},
                {code: 0x66, cmd: [], desc: 'Чтение даты изготовления', func: ff.dateProd}
            ],
            first:    [// параметры читаемые один раз при запуске драйвера
                {code: 0x29, cmd: [], desc: 'Чтение напряжения на литиевой батарее', func: ff.batteryVolt}
            ],
            poll:     [
                {code: 0x27, cmd: [], desc: 'Чтение содержимого тарифных аккумуляторов активной энергии', func: ff.totalEnergy},
                {code: 0x2b, cmd: [], desc: 'Чтение времени последнего отключения напряжения', func: ff.voltageOff},
                {code: 0x2c, cmd: [], desc: 'Чтение времени последнего включения напряжения', func: ff.voltageOn},
                {code: 0x21, cmd: [], desc: 'Чтение внутренних часов и календаря счетчика', func: ff.readDateTime},
                {code: 0x22, cmd: [], desc: 'Чтение лимита мощности', func: ff.limitPower},
                {code: 0x23, cmd: [], desc: 'Чтение лимита энергии за месяц', func: ff.limitEnergyMonth},
                //{code: 0x32, cmd: currentMonth(), desc: 'Чтение энергии за текущий месяц', func: ff.month12Energy}
                {code: 0x32, cmd: [0x0f], desc: 'Чтение энергии за текущий месяц', func: ff.month12Energy}
                //{code: 0x69, cmd: [], desc: 'Чтение времени наработки', func: ff.runningTime},
                //{code: 0x37, cmd: [0x01, 0x07, 0x12, 0x29], desc: 'Чтение получасовых мощностей или суточных срезов', func: ff.readDay}, //ADDR-CMD-N48-dd-mon-yy-CRC
                //{code: 0x33, cmd: [0x00], desc: 'Чтение максимумов U', func: ff.readMaxU},
                //{code: 0x33, cmd: [0x01], desc: 'Чтение максимумов I', func: ff.readMaxU},
                //{code: 0x33, cmd: [0x02], desc: 'Чтение максимумов P', func: ff.readMaxU}
            ],
            fastpoll: [
                {code: 0x63, cmd: [], desc: 'Чтение значений U,I,P', func: ff.readUIP},
                {code: 0x81, cmd: [], desc: 'Чтение доп. параметров сети (частота)  и теку-щего тарифа', func: ff.readFreq},
                {code: 0x86, cmd: [0x00], desc: 'Чтение параметра 0', func: ff.readParams0},
                {code: 0x86, cmd: [0x02], desc: 'Чтение параметра 2', func: ff.readParams2}
                //{code: 0x26, cmd: [], desc: 'Чтение текущей мощности в нагрузке', func: ff.currentPower}
            ],
            read:     [
                {cmd: 0x20, desc: 'Чтение группового адреса счетчика'},
                {cmd: 0x24, desc: 'Чтение флага сезонного времени '},
                {cmd: 0x25, desc: 'Чтение величины коррекции времени '},
                {cmd: 0x27, desc: 'Чтение содержимого тарифных аккумуляторов активной энергии'},
                {cmd: 0x2A, desc: 'Чтение режима индикации'},
                {cmd: 0x2E, desc: 'Чтение кол-ва действующих тарифов'},
                {cmd: 0x30, desc: 'Чтение таблицы праздничных дней'},
                {cmd: 0x31, desc: 'Чтение таблицы переключений тарифных зон '},
                {cmd: 0x33, desc: 'Чтение максимумов'},
                {cmd: 0x34, desc: 'Чтение буфера событий вкл/выкл'},
                {cmd: 0x35, desc: 'Чтение буфера событий отк/закр'},
                {cmd: 0x36, desc: 'Чтение буфера событий параметризации'},
                {cmd: 0x37, desc: 'Чтение получасовых мощностей или суточных срезов'},
                {cmd: 0x38, desc: 'Чтение месячных срезов реактивной энергии'},
                {cmd: 0x39, desc: 'Чтение буфера событий качества электричества'},
                {cmd: 0x3A, desc: 'Чтение буфера событий реле'},
                {cmd: 0x60, desc: 'Чтение тарифа'},
                {cmd: 0x61, desc: 'Чтение времени по-следнего вскрытия крышки счётчика'},
                {cmd: 0x62, desc: 'Чтение времени по-следнего закрытия крышки счётчика'},
                {cmd: 0x64, desc: 'Чтение коэффициента коррекции хода часов (для чтения коэффициента коррекции без перемычки)'},
                {cmd: 0x67, desc: 'Чтение времени индикации'},
                {cmd: 0x68, desc: 'Чтение режима ли-мита мощности'},
                {cmd: 0x69, desc: 'Чтение времени наработки'},
                {cmd: 0x6A, desc: 'Чтение режима доп. индикации'},
                {cmd: 0x6B, desc: 'Чтение времени последней парам. счётчика'},
                {cmd: 0x6C, desc: 'Чтение номера мо-дема и системы и уровня сигнала'},
                {cmd: 0x6D, desc: 'Чтение режима управления реле'},
                {cmd: 0x6E, desc: 'Чтение потарифных лимитов Энергии (остатки)'},
                {cmd: 0x6F, desc: 'Чтение флага разрешения индикации под батарейкой'},
                {cmd: 0x80, desc: 'Чтение флага разрешения мо-дема PLC2'},
                {cmd: 0x81, desc: 'Чтение доп. параметров сети (частота)  и теку-щего тарифа'},
                {cmd: 0x82, desc: 'Чтение множителя таймаута'},
                {cmd: 0x85, desc: 'Чтение содержимо-го тарифных акку-муляторов реактив-ной энергии'},
                {cmd: 0x86, desc: 'Чтение параметра'}
            ],
            write:    [
                {cmd: 0x00, desc: 'Установка нового сетевого адреса счетчика'},
                {cmd: 0x01, desc: 'Установка нового группового адреса счетчика'},
                {cmd: 0x02, desc: 'Установка внутренних часов и календаря счетчика'},
                {cmd: 0x03, desc: 'Установка лимита мощности'},
                {cmd: 0x04, desc: 'Установка лимита энергии за месяц'},
                {cmd: 0x05, desc: 'Установка флага сезонного времени '},
                {cmd: 0x06, desc: 'Установка величины коррекции времени'},
                {cmd: 0x07, desc: 'Установка функции выходного оптрона'},
                {cmd: 0x08, desc: 'Установка скорости обмена '},
                {cmd: 0x09, desc: 'Установка режимаиндикации'},
                {cmd: 0x0A, desc: 'Установка числа действующих тарифов'},
                {cmd: 0x0B, desc: 'Установка тарифа'},
                {cmd: 0x0C, desc: 'Сброс защёлки «напряжение батареи»'},
                {cmd: 0x0D, desc: 'Установка времени индикации'},
                {cmd: 0x0F, desc: 'Установка режима лимита мощности'},
                {cmd: 0x10, desc: 'Установка таблицы праздничных дней'},
                {cmd: 0x11, desc: 'Установка таблицы переключений тарифных зон '},
                {cmd: 0x12, desc: 'Сброс максимумов'},
                {cmd: 0x13, desc: 'Сброс максимумов. Под перемычкой'},
                {cmd: 0x14, desc: 'Сброс наработки батареи.'},
                {cmd: 0x20, desc: 'Чтение группового адреса счетчика'},
                {cmd: 0x21, desc: 'Чтение внутренних часов и календаря счетчика'},
                {cmd: 0x22, desc: 'Чтение лимита мощности'},
                {cmd: 0x23, desc: 'Чтение лимита энергии за месяц'},
                {cmd: 0x24, desc: 'Чтение флага сезонного времени '},
                {cmd: 0x25, desc: 'Чтение величины коррекции времени '},
                {cmd: 0x26, desc: 'Чтение текущей мощности в нагрузке'},
                {cmd: 0x27, desc: 'Чтение содержимого тарифных аккумуляторов активной энергии'},
                {cmd: 0x28, desc: 'Чтение идентификационных данных счетчика'},
                {cmd: 0x29, desc: 'Чтение напряжения на литиевой батарее'},
                {cmd: 0x2A, desc: 'Чтение режима индикации'},
                {cmd: 0x2B, desc: 'Чтение времени последнего отключения напряжения'},
                {cmd: 0x2C, desc: 'Чтение времени последнего включения напряжения'},
                {cmd: 0x2D, desc: 'Чтение функции выходного оптрона'},
                {cmd: 0x2E, desc: 'Чтение кол-ва действующих тарифов'},
                {cmd: 0x2F, desc: 'Чтение серийного номера'},
                {cmd: 0x30, desc: 'Чтение таблицы праздничных дней'},
                {cmd: 0x31, desc: 'Чтение таблицы переключений тарифных зон '},
                {cmd: 0x32, desc: 'Чтение месячных срезов '},
                {cmd: 0x33, desc: 'Чтение максимумов'},
                {cmd: 0x34, desc: 'Чтение буфера событий вкл/выкл'},
                {cmd: 0x35, desc: 'Чтение буфера событий отк/закр'},
                {cmd: 0x36, desc: 'Чтение буфера событий параметризации'},
                {cmd: 0x37, desc: 'Чтение получасовых мощностей или суточных срезов'},
                {cmd: 0x38, desc: 'Чтение месячных срезов реактивной энергии'},
                {cmd: 0x39, desc: 'Чтение буфера событий качества электричества'},
                {cmd: 0x3A, desc: 'Чтение буфера событий реле'},
                {cmd: 0x60, desc: 'Чтение тарифа'},
                {cmd: 0x61, desc: 'Чтение времени по-следнего вскрытия крышки счётчика'},
                {cmd: 0x62, desc: 'Чтение времени по-следнего закрытия крышки счётчика'},
                {cmd: 0x63, desc: 'Чтение  значений U,I,P'},
                {
                    cmd:  0x64,
                    desc: 'Чтение коэффициента  коррекции хода часовВведена для чтения коэффициента  коррекции без перемычки'
                },
                {cmd: 0x65, desc: 'Чтение слова исполнения'},
                {cmd: 0x66, desc: 'Чтение даты изготовления'},
                {cmd: 0x67, desc: 'Чтение времени индикации'},
                {cmd: 0x68, desc: 'Чтение режима ли-мита мощности'},
                {cmd: 0x69, desc: 'Чтение времени наработки'},
                {cmd: 0x6A, desc: 'Чтение режима доп. индикации'},
                {cmd: 0x6B, desc: 'Чтение времени по-следней парам. счётчика'},
                {cmd: 0x6C, desc: 'Чтение номера мо-дема и системы и уровня сигнала'},
                {cmd: 0x6D, desc: 'Чтение режима управления реле'},
                {cmd: 0x6E, desc: 'Чтение потариф-ных лимитов Энергии (остатки)'},
                {cmd: 0x6F, desc: 'Чтение флага раз-решения индикации под батарейкой'},
                {cmd: 0x70, desc: 'Установка режима доп. индикации'},
                {cmd: 0x71, desc: 'Установка режима управления реле'},
                {cmd: 0x72, desc: 'Установка пота-рифных лимитов энергии'},
                {cmd: 0x73, desc: 'Установкафлага разрешения инди-кации под батарей-кой'},
                {cmd: 0x74, desc: 'Установка флага разрешения работы с модемом PLC2'},
                {cmd: 0x75, desc: 'Установка множи-теля таймаута'},
                {cmd: 0x78, desc: 'Установка тариф-ного расписания сжатым методом'},
                {cmd: 0x79, desc: 'Обмен данными с PLC1 модемом'},
                {cmd: 0x7A, desc: 'Запись параметра'},
                {cmd: 0x80, desc: 'Чтение флага разрешения мо-дема PLC2'},
                {cmd: 0x81, desc: 'Чтение доп. па-раметров сети (частота)  и теку-щего тарифа'},
                {cmd: 0x82, desc: 'Чтение множителя таймаута'},
                {cmd: 0x85, desc: 'Чтение содержимо-го тарифных акку-муляторов реактив-ной энергии'},
                {cmd: 0x86, desc: 'Чтение параметра'}
            ]
        },
        2: {
            first:    [ // параметры читаемые один раз при запуске драйвера
                // Формируется динамически, запрос помесячно за год.
            ],
            poll:     [
                {code: 0x05, cmd: [0x00, 0x00], desc: 'Чтение накопленной энергии от сброса', func: f.totalEnergy},
                {code: 0x05, cmd: [0x10, 0x00], desc: 'Чтение накопленной энергии за текущий год', func: f.yearEnergy},
                {code: 0x05, cmd: [0x40, 0x00], desc: 'Чтение энергии за текущие сутки', func: f.currentDayEnergy},
                {code: 0x05, cmd: [0x00, 0x01], desc: 'Чтение энергия по 1 тарифу', func: f.oneTarrif},
                {code: 0x05, cmd: [0x00, 0x02], desc: 'Чтение энергия по 2 тарифу', func: f.twoTarrif},
                {code: 0x05, cmd: [0x00, 0x03], desc: 'Чтение энергия по 3 тарифу', func: f.threeTarrif},
                {code: 0x05, cmd: [0x00, 0x04], desc: 'Чтение энергия по 4 тарифу', func: f.fourTarrif},
                {code: 0x04, cmd: [0x00], desc: 'Чтение текущего времени', func: f.readCurrentTime},
                {code: 0x04, cmd: [0x14, 0x00], desc: 'Чтение байт состояния', func: f.statusByte}
            ],
            fastpoll: [
                {code: 0x08, cmd: [0x16, 0x00], desc: 'Активная мощность по фазам P', func: f.powerPhaseP},
                {code: 0x08, cmd: [0x16, 0x08], desc: 'Полная мощность по фазам S', func: f.powerPhaseS},
                {code: 0x08, cmd: [0x16, 0x04], desc: 'Реактивная мощность по фазам Q', func: f.powerPhaseQ},
                {code: 0x08, cmd: [0x16, 0x11], desc: 'Напряжение по фазам', func: f.voltagePhase},
                {code: 0x08, cmd: [0x16, 0x21], desc: 'Ток по фазам', func: f.currentPhase},
                {code: 0x08, cmd: [0x16, 0x30], desc: 'Коэффициент мощности по фазам', func: f.cosf},
                {code: 0x08, cmd: [0x16, 0x40], desc: 'Частота сети', func: f.freq},
                {code: 0x08, cmd: [0x16, 0x70], desc: 'Температура внутри прибора', func: f.intemp}
            ],
            read:     [
                {cmd: 0x01, desc: 'Ускоренный режим чтения индивидуальных параметров прибора', func: f.acceleratedMode},
                {cmd: 0x04, desc: 'Чтение множителя таймаута дополнительного интерфейса', func: f.timeoutInterface2},
                {cmd: 0x06, desc: 'Чтение режимов индикации', func: f.indicationMode},
                {cmd: 0x07, desc: 'Чтение значений времен перехода на летнее и зимнее время', func: f.timeSummerWinter},
                {
                    cmd:  0x08,
                    desc: 'Чтение времени контроля за превышением лимита мощностии параметров автовключения реле', func: f.timeLimitPRele
                },
                {cmd: 0x09, desc: 'Чтение программируемых флагов', func: f.programFlag},
                {
                    cmd: 0x0C, desc: 'Чтение расписания утренних и вечерних максимумов мощности', func: f.timeMorningEveningMax
                },
                {
                    cmd:  0x0D,
                    desc: 'Чтение значений утренних и вечерних максимумов мощности', func: f.valueMorningEveningMax
                },
                {
                    cmd:  0x11,
                    desc: 'Чтение вспомогательных параметров: мгновенной активной, реактивной, полной мощности, фазных и линейных напряжений, тока, коэффициента мощности, частоты и небаланса',
                    func: f.moreParam
                },

                {
                    cmd:  0x13,
                    desc: 'Чтение параметров последней записи основного массива средних мощностей', func: f.lastArrPower
                },
                {cmd: 0x14, desc: 'Чтение зафиксированных данных', func: f.recordedData},
                {
                    cmd:  0x15,
                    desc: 'Чтение параметров последней записи дополнительного массива средних мощностей', func: f.lastMoreArrPower
                }, {
                    cmd:  0x16,
                    desc: 'Чтение вспомогательных параметров: мгновенной активной, реактивной, полной мощности, фазных и линейных, напряжений, тока, коэффициента мощности, частоты, небаланса',
                    func: f.moreParam2
                },
                {cmd: 0x17, desc: 'Чтение байта состояния тарификатора', func: f.statusByteTariff},
                {cmd: 0x18, desc: 'Чтение слова состояния управления нагрузкой', func: f.statusLoadManagement},
                {cmd: 0x19, desc: 'Чтение лимита мощности', func: f.limitPower},
                {cmd: 0x1A, desc: 'Чтение лимита энергии по тарифу 1–4', func: f.limitEnergyTariff},
                {
                    cmd:  0x1B,
                    desc: 'Чтение параметров индикации счетчика (по индицируемым тарифам)', func: f.paramIndicatorTariff
                },
                {
                    cmd:  0x1C,
                    desc: 'Чтение параметров индикации счетчика (по периодам индикации)',
                    func: f.paramIndicatorPeriod
                },
                {cmd: 0x1D, desc: 'Чтение множителя таймаута основного интерфейса', func: f.factorTimeout},
                {cmd: 0x1E, desc: 'Чтение параметров режима учета технических потерь', func: f.paramLossMode},
                {cmd: 0x1F, desc: 'Чтение мощностей технических потерь', func: f.powerTechLosses},
                {cmd: 0x20, desc: 'Чтение допустимых значений', func: f.validValues},
                {cmd: 0x21, desc: 'Чтение значений времен усреднения', func: f.valueAvgTime},
                {cmd: 0x22, desc: 'Чтение тарифного расписания', func: f.tariffSchedule},
                {cmd: 0x23, desc: 'Чтение расписания праздничных дней', func: f.holidaySchedules},
                {cmd: 0x24, desc: 'Чтение состояния длительных операций', func: f.statesLongOp},
                {cmd: 0x27, desc: 'Чтение параметров PLC1', func: f.paramPlc1},
                {cmd: 0x2A, desc: 'Чтение серийного номера выносного дисплея из прибора учета', func: f.snExtDisplay},
                {cmd: 0x00, desc: 'Инициализация основного массива средних мощностей (срезов)'},
                {cmd: 0x01, desc: 'Запись параметров индикации счетчика (по индицируемым тарифам)'},
                {cmd: 0x02, desc: 'Запись параметров индикации счетчика (по периодам индикации)'},
                {cmd: 0x03, desc: 'Запись параметров индикации счетчика'},
                {cmd: 0x04, desc: 'Вкл./выкл. режима «Тест»'},
                {cmd: 0x05, desc: 'Запись нового сетевого адреса счетчика'},
                {cmd: 0x06, desc: 'Инициализация дополнительного массива средних мощностей (срезов)'},
                {cmd: 0x08, desc: 'Фиксация данных'},
                {cmd: 0x0C, desc: 'Установка времени'},
                {cmd: 0x0D, desc: 'Коррекция времени в пределах ±4 мин. один раз в сутки'},
                {cmd: 0x10, desc: 'Запрет записи параметров по PLC1'},
                {cmd: 0x11, desc: 'Запись параметров PLC1'},
                {cmd: 0x14, desc: 'Изменить параметры связи дополнительного интерфейса'},
                {cmd: 0x15, desc: 'Изменить параметры связи основного интерфейса'},
                {cmd: 0x16, desc: 'Перезапустить счетчик'},
                {cmd: 0x18, desc: 'Разрешить/запретить автоматический переход на зимнее/летнее время'},
                {cmd: 0x19, desc: 'Значения времени перехода для летнего и зимнего времени'},
                {cmd: 0x1A, desc: 'Запись серийного номера выносного дисплея'},
                {cmd: 0x1B, desc: 'Записать коэффициенты транс-формации Кн и Кт'},
                {cmd: 0x1D, desc: 'Записать тарифное расписание'},
                {cmd: 0x1E, desc: 'Записать расписание празднич-ных дней'},
                {cmd: 0x1F, desc: 'Изменить пароль'},
                {cmd: 0x21, desc: 'Инициализация регистров энергии'},
                {cmd: 0x22, desc: 'Запись местоположения прибора'},
                {cmd: 0x23, desc: 'Запись расписания утреннего и вечернего максимумов'},
                {cmd: 0x24, desc: 'Сброс значений массива помесячных максимумов'},
                {
                    cmd:  0x26,
                    desc: 'Установка времени контроля за превышением лимита мощностии параметров автовключения реле'
                },
                {cmd: 0x27, desc: 'Изменение постоянной счетчика'},
                {cmd: 0x2A, desc: 'Изменение режима тарификатора'},
                {cmd: 0x2C, desc: 'Установка лимита активной мощности'},
                {cmd: 0x2D, desc: 'Включение контроля превышения лимита активной мощности'},
                {cmd: 0x2E, desc: 'Установка лимита потребленной активной энергии'},
                {cmd: 0x2F, desc: 'Включение контроля превышения потребленной активной энергии'},
                {cmd: 0x30, desc: 'Изменение режима импульсного выхода'},
                {cmd: 0x31, desc: 'Изменение режима управления нагрузкой'},
                {cmd: 0x32, desc: 'Изменение множителя таймаута основного интерфейса'},
                {cmd: 0x33, desc: 'Изменение режима учета технических потерь'},
                {cmd: 0x34, desc: 'Установка значений мощностей технических потерь'},
                {cmd: 0x35, desc: 'Изменение режима светодиодного индикатора и импульсного выхода R+ по виду энергии'},
                {cmd: 0x36, desc: 'Установка допустимых значений при контроле ПКЭ'},
                {cmd: 0x37, desc: 'Установка времени усреднения значений напряжения и частоты'},
                {cmd: 0x00, desc: 'Чтение текущего времени'},
                {cmd: 0x01, desc: 'Чтение времени включения/выключения прибора'},
                {cmd: 0x02, desc: 'Чтение времени коррекции часов прибора'},
                {cmd: 0x03, desc: 'Чтение времени включения/выключения фазы 1 прибора'},
                {cmd: 0x04, desc: 'Чтение времени включения/выключения фазы 2 прибора'},
                {cmd: 0x05, desc: 'Чтение времени включения/выключения фазы 3 прибора'},
                {cmd: 0x06, desc: 'Чтение времени начала/окончания превышения лимита мощности прибора'},
                {cmd: 0x07, desc: 'Чтение времени коррекции тарифного расписания'},
                {cmd: 0x08, desc: 'Чтение времени коррекции расписания праздничных дней'},
                {cmd: 0x09, desc: 'Чтение времени сброса регистров накопленной энергии'},
                {cmd: 0x0A, desc: 'Чтение времени инициализации массива средних мощностей'},
                {cmd: 0x0B, desc: 'Чтение времени превышения лимита энергии по тарифу 1'},
                {cmd: 0x0C, desc: 'Чтение времени превышения лимита энергии по тарифу 2'},
                {cmd: 0x0D, desc: 'Чтение времени превышения лимита энергии по тарифу 3'},
                {cmd: 0x0E, desc: 'Чтение времени превышения лимита энергии по тарифу 4'},
                {cmd: 0x0F, desc: 'Чтение времени коррекции параметров контроля за превышением лимита мощности'},
                {cmd: 0x10, desc: 'Чтение времени коррекции параметров контроля за превышением лимита энергии'},
                {cmd: 0x11, desc: 'Чтение времени коррекции параметров учета технических потерь'},
                {cmd: 0x12, desc: 'Чтение времени вскрытия/закрытия прибора'},
                {cmd: 0x13, desc: 'Чтение времени и кода перепрограммирования прибора'},
                {cmd: 0x14, desc: 'Чтение времени и кода слова состояния прибора'},
                {cmd: 0x15, desc: 'Чтение времени коррекции расписания утренних и вечерних максимумов мощности'},
                {cmd: 0x16, desc: 'Чтение времени сброса массива значений максимумов мощности'},
                {cmd: 0x17, desc: 'Чтение времени включения/выключения тока фазы 1 прибора'},
                {cmd: 0x18, desc: 'Чтение времени включения/выключения тока фазы 2 прибора'},
                {cmd: 0x19, desc: 'Чтение времени включения/выключения тока фазы 3 прибора'},
                {cmd: 0x1A, desc: 'Чтение времени начала/окончания магнитного воздействия'},
                {
                    cmd:  0x20,
                    desc: 'Чтение времени выхода/возврата за мин.предельно допустимое значение напряжения в фазе 1'
                },
                {
                    cmd: 0x21,
                    desc:
                         'Чтение времени выхода/возврата за мин.нормально допустимое значение напряжения в фазе 1'
                },
                {
                    cmd: 0x22,
                    desc:
                         'Чтение времени выхода/возврата за макс. нормально допустимое значение напряжения в фазе 1'
                },
                {
                    cmd: 0x23,
                    desc:
                         'Чтение времени выхода/возврата за макс. предельно допустимое значение напряжения в фазе 1'
                },
                {
                    cmd: 0x24,
                    desc:
                         'Чтение времени выхода/возврата за мин.предельно допустимое значение напряжения в фазе 2'
                },
                {
                    cmd: 0x25,
                    desc:
                         'Чтение времени выхода/возврата за мин.нормально допустимое значение напряжения в фазе 2'
                },
                {
                    cmd: 0x26,
                    desc:
                         'Чтение времени выхода/возврата за макс. нормально допустимое значение напряжения в фазе 2'
                },
                {
                    cmd: 0x27,
                    desc:
                         'Чтение времени выхода/возврата за макс. предельно допустимое значение напряжения в фазе 2'
                },
                {
                    cmd: 0x28,
                    desc:
                         'Чтение времени выхода/возврата за мин.предельно допустимое значе-ние напряжения в фазе 3'
                },
                {
                    cmd: 0x29,
                    desc:
                         'Чтение времени выхода/возврата за мин.нормально допустимое значе-ние напряжения в фазе 3'
                },
                {
                    cmd: 0x2A,
                    desc:
                         'Чтение времени выхода/возврата за макс. нормально допустимое значе-ние напряжения в фазе 3'
                },
                {
                    cmd: 0x2B,
                    desc:
                         'Чтение времени выхода/возврата за макс. предельно допустимое значе-ние напряжения в фазе 3'
                },
                {
                    cmd: 0x2C, desc:
                         'Чтение времени выхода/возврата за мин.предельно допустимое значе-ние частоты сети'
                }
                ,
                {
                    cmd: 0x2D, desc:
                         'Чтение времени выхода/возврата за мин.нормально допустимое значе-ние частоты сети'
                }
                ,
                {
                    cmd: 0x2E,
                    desc:
                         'Чтение времени выхода/возврата за макс. нормально допустимое значе-ние частоты сети'

                },
                {
                    cmd: 0x2F,
                    desc:
                         'Чтение времени выхода/возврата за макс. предельно допустимое значе-ние частоты сети'

                },
                {
                    cmd: 0x30, desc:
                         'Чтение параметров провалов/перенапряжений по фазе 1'
                }
                ,
                {
                    cmd: 0x31, desc:
                         'Чтение параметров провалов/перенапряжений по фазе 2'
                }
                ,
                {
                    cmd: 0x32, desc:
                         'Чтение параметров провалов/перенапряжений по фазе 3'
                }
                ,
                {
                    cmd: 0x80, desc:
                         'Время возникновения/пропадания обратного тока по фазе 1'
                }
                ,
                {
                    cmd: 0x81, desc:
                         'Время возникновения/пропадания обратного тока по фазе 2'
                }
                ,
                {
                    cmd: 0x82, desc:
                         'Время возникновения/пропадания обратного тока по фазе 3'
                }
                ,
                {
                    cmd: 0x83, desc:
                         'Время начала/окончания отсутствия напряжения при наличии тока по фазе 1'
                }
                ,
                {
                    cmd: 0x84, desc:
                         'Время начала/окончания отсутствия напряжения при наличии тока по фазе 2'
                }
                ,
                {
                    cmd: 0x85, desc:
                         'Время начала/окончания отсутствия напряжения при наличии тока по фазе 3'
                }
                ,
                {
                    cmd: 0x86, desc:
                         'Время начала/окончания нарушения чередования фаз'
                }
            ],
            readinfo: [
                {
                    code: 0x08,
                    cmd:  [0x00],
                    desc: 'Чтение серийногономера счетчика и даты выпуска', func: f.readSnAndDate
                },
                {code: 0x08, cmd: [0x03], desc: 'Чтение версии ПО', func: f.firmwareVersion},
                {code: 0x08, cmd: [0x0B], desc: 'Чтение местоположения прибора', func: f.readLocation},
                {code: 0x08, cmd: [0x12], desc: 'Чтение варианта исполнения', func: f.variantExecution},
                {code: 0x08, cmd: [0x26], desc: 'Чтение CRC16 ПО прибора', func: f.crcDevice},
                {code: 0x08, cmd: [0x02], desc: 'Чтение коэффициента трансформации', func: f.transformRatio}
            ],
            write:
                      [
                          /*cmd:				0x00, level: '2,3', 	desc: 'Инициализация основного массива средних мощностей (срезов)'),
                          cmd:				0x01, level: '1,2,3',	desc: 'Запись параметров индикации счетчика (по индицируемым тарифам)'),
                          cmd:				0x02, level: '1,2,3',	desc: 'Запись параметров индикации счетчика (по периодам индикации)'),
                          cmd:				0x03, level: '1,2,3',	desc: 'Запись параметров индикации счетчика'),
                          setTest:			0x04, level: '2,3',		desc: 'Вкл./выкл. режима «Тест»'),
                          setAddr:			0x05, level: '1,2,3',	desc: 'Запись нового сетевого адреса счетчика'),
                          cmd:				0x06, level: '2,3',		desc: 'Инициализация дополнительного массива средних мощностей (срезов)'),
                          Save:				0x08, level: '0',		desc: 'Фиксация данных'),
                          setTimeDate:		0x0C, level: '2,3',		desc: 'Установка времени'),
                          cmd:				0x0D, level: '1,2,3',	desc: 'Коррекция времени в пределах ±4 мин. один раз в сутки'),
                          cmd:				0x10, level: '2,3',		desc: 'Запрет записи параметров по PLC1'),
                          cmd:				0x11, level: '2,3',		desc: 'Запись параметров PLC1'),
                          cmd:				0x14, level: '1,2,3',	desc: 'Изменить параметры связи дополнительного интерфейса'),
                          cmd:				0x15, level: '1,2,3',	desc: 'Изменить параметры связи основного интерфейса'),
                          Reboot: 			0x16, level: '2,3',		desc: 'Перезапустить счетчик'),
                          cmd:				0x18, level: '2,3',		desc: 'Разрешить/запретить автоматический переход на зимнее/летнее время'),
                          cmd:				0x19, level: '2,3',		desc: 'Значения времени перехода для летнего и зимнего времени'),
                          cmd:				0x1A, level: '2,3',		desc: 'Запись серийного номера выносного дисплея'),
                          cmd:				0x1B, level: '2,3',		desc: 'Записать коэффициенты транс-формации Кн и Кт'),
                          cmd:				0x1D, level: '2,3',		desc: 'Записать тарифное расписание'),
                          cmd:				0x1E, level: '2,3',		desc: 'Записать расписание праздничных дней'),
                          setPwd: 			0x1F, level: '2,3',		desc: 'Изменить пароль'),
                          cmd:				0x21, level: '2,3',		desc: 'Инициализация регистров энергии'),
                          setLocation:		0x22, level: '2,3',		desc: 'Запись местоположения прибора'),
                          cmd:				0x23, level: '2,3',		desc: 'Запись расписания утреннего и вечернего максимумов'),
                          ClearMax:			0x24, level: '2,3',		desc: 'Сброс значений массива помесячных максимумов'),
                          cmd:				0x26, level: '2,3',		desc: 'Установка времени контроля за превышением лимита мощностии параметров автовключения реле'),
                          cmd:				0x27, level: '2,3',		desc: 'Изменение постоянной счетчика'),
                          cmd:				0x2A, level: '2,3',		desc: 'Изменение режима тарификатора'),
                          setLimitAPower:		0x2C, level: '2,3',		desc: 'Установка лимита активной мощности'),
                          cmd:				0x2D, level: '2,3',		desc: 'Включение контроля превышения лимита активной мощности'),
                          cmd:				0x2E, level: '2,3',		desc: 'Установка лимита потребленной активной энергии'),
                          setLimitAEnergy:	0x2F, level: '2,3',		desc: 'Включение контроля превышения потребленной активной энергии'),
                          setImpulse: 		0x30, level: '2,3',		desc: 'Изменение режима импульсного выхода'),
                          cmd:				0x31, level: '2,3',		desc: 'Изменение режима управления нагрузкой'),
                          setTimeout: 		0x32, level: '1,2,3',	desc: 'Изменение множителя таймаута основного интерфейса'),
                          cmd:				0x33, level: '2,3',		desc: 'Изменение режима учета технических потерь'),
                          cmd:				0x34, level: '2,3',		desc: 'Установка значений мощностей технических потерь'),
                          cmd:				0x35, level: '2,3',		desc: 'Изменение режима светодиодного индикатора и импульсного выхода R+ по виду энергии'),
                          cmd:				0x36, level: '2,3',		desc: 'Установка допустимых значений при контроле ПКЭ'),
                          cmd:				0x37, level: '2,3',		desc: 'Установка времени усреднения значений напряжения и частоты'),*/
                      ]
        }
    },
    respcode: {
        0:
            'Everything is fine',
        1:
            'Invalid command or parameter',
        2:
            'Invalid command or parameter',
        3:
            'Not enough level to satisfy request',
        4:
            'The counter’s internal clock has already been adjusted during the current day.',
        5:
            'Communication channel not open, try again later'
    },
    model:    {
        200:
            {
                name: '200', type:
                      1, desc:
                      {
                          ru: 'Меркурий-200', en:
                              'Mercury-200'
                      }
            }
        ,
        201:
            {
                name: '201', type:
                      1, desc:
                      {
                          ru: 'Меркурий-201', en:
                              'Mercury-201'
                      }
            }
        ,
        203:
            {
                name: '203', type:
                      1, desc:
                      {
                          ru: 'Меркурий-203', en:
                              'Mercury-203'
                      }
            }
        ,
        206:
            {
                name: '206', type:
                      1, desc:
                      {
                          ru: 'Меркурий-206', en:
                              'Mercury-206'
                      }
            }
        ,
        2032:
            {
                name: '2032', type:
                      2, desc:
                      {
                          ru: 'Меркурий-203.2TD', en:
                              'Mercury-203.2TD'
                      }
            }
        , //двунаправленный
        204:
            {
                name: '204', type:
                      2, desc:
                      {
                          ru: 'Меркурий-204', en:
                              'Mercury-204'
                      }
            }
        , //двунаправленный
        208:
            {
                name: '208', type:
                      2, desc:
                      {
                          ru: 'Меркурий-208', en:
                              'Mercury-208'
                      }
            }
        , //Двунаправленный
        230:
            {
                name: '230', type:
                      2, desc:
                      {
                          ru: 'Меркурий-230', en:
                              'Mercury-230'
                      }
            }
        ,
        231:
            {
                name: '231', type:
                      2, desc:
                      {
                          ru: 'Меркурий-231', en:
                              'Mercury-231'
                      }
            }
        ,
        233:
            {
                name: '233', type:
                      2, desc:
                      {
                          ru: 'Меркурий-233', en:
                              'Mercury-233'
                      }
            }
        ,
        234:
            {
                name: '234', type:
                      2, desc:
                      {
                          ru: 'Меркурий-234', en:
                              'Mercury-234'
                      }
            }
        ,
        236:
            {
                name: '236', type:
                      2, desc:
                      {
                          ru: 'Меркурий-236', en:
                              'Mercury-236'
                      }
            }
        ,
        238:
            {
                name: '238', type:
                      2, desc:
                      {
                          ru: 'Меркурий-238', en:
                              'Mercury-238'
                      }
            }
    }
};

const statusByte = {
    6: [
        {code: 'Е-01', desc: translate('Напряжение батареи менее 2,2 В')},
        {code: 'Е-02', desc: translate('Нарушено функционирование памяти №2')},
        {code: 'Е-03', desc: translate('Нарушено функционирование UART1')},
        {code: 'Е-04', desc: translate('Нарушено функционирование ADS')},
        {code: 'Е-05', desc: translate('Ошибка обмена с памятью №1')},
        {code: 'Е-06', desc: translate('Нарушено функционирование RTC')},
        {code: 'Е-07', desc: translate('Нарушено функционирование памяти №3')},
        {code: 'Е-08', desc: translate('')}
    ],
    5: [
        {code: 'Е-09', desc: translate('Ошибка КС программы')},
        {code: 'Е-10', desc: translate('Ошибка КС массива калибровочных коэфф. во Flash MSP430')},
        {code: 'Е-11', desc: translate('Ошибка КС массива регистров накопленной энергии')},
        {code: 'Е-12', desc: translate('Ошибка КС адреса прибора')},
        {code: 'Е-13', desc: translate('Ошибка КС серийного номера')},
        {code: 'Е-14', desc: translate('Ошибка КС пароля')},
        {code: 'Е-15', desc: translate('Ошибка КС массива варианта исполнения счетчика')},
        {code: 'Е-16', desc: translate('Ошибка КС байта тарификатора')}
    ],
    4: [
        {code: 'Е-17', desc: translate('Ошибка КС байта управления нагрузкой')},
        {code: 'Е-18', desc: translate('Ошибка КС лимита мощности')},
        {code: 'Е-19', desc: translate('Ошибка КС лимита энергии')},
        {code: 'Е-20', desc: translate('Ошибка КС байта параметров UART')},
        {code: 'Е-21', desc: translate('Ошибка КС параметров индикации(по тарифам)')},
        {code: 'Е-22', desc: translate('Ошибка КС параметров индикации (по периодам)')},
        {code: 'Е-23', desc: translate('Ошибка КС множителя тайм-аута')},
        {code: 'Е-24', desc: translate('Ошибка КС байта программируемых флагов')}
    ],
    3: [
        {code: 'Е-25', desc: translate('Ошибка КС массива праздничных дней')},
        {code: 'Е-26', desc: translate('Ошибка КС массива тарифного расписания')},
        {code: 'Е-27', desc: translate('Ошибка КС массива таймера')},
        {code: 'Е-28', desc: translate('Ошибка КС массива сезонных переходов')},
        {code: 'Е-29', desc: translate('Ошибка КС массива местоположения прибора')},
        {code: 'Е-30', desc: translate('Ошибка КС массива коэффициентов трансформации')},
        {code: 'Е-31', desc: translate('Ошибка КС массива регистров накопления по периодам времени')},
        {code: 'Е-32', desc: translate('Ошибка КС параметров среза')}
    ],
    2: [
        {code: 'Е-33', desc: translate('Ошибка КС регистров среза')},
        {code: 'Е-34', desc: translate('Ошибка КС указателей журнала событий')},
        {code: 'Е-35', desc: translate('Ошибка КС записи журнала событий')},
        {code: 'Е-36', desc: translate('Ошибка КС регистра учета технических потерь')},
        {code: 'Е-37', desc: translate('Ошибка КС мощностей технических потерь')},
        {code: 'Е-38', desc: translate('Ошибка КС массива регистров накопленной энергии потерь')},
        {code: 'Е-39', desc: translate('Ошибка КС регистров энергии пофазного учета')},
        {code: 'Е-40', desc: translate('Флаг поступления широковещательного сообщения')}
    ],
    1: [
        {code: 'Е-41', desc: translate('Ошибка КС указателей журнала ПКЭ')},
        {code: 'Е-42', desc: translate('Ошибка КС записи журнала ПКЭ')},
        {code: 'Е-43', desc: translate('')},
        {code: 'Е-44', desc: translate('')},
        {code: 'Е-45', desc: translate('')},
        {code: 'Е-46', desc: translate('')},
        {code: 'Е-47', desc: translate('Флаг выполнения процедуры коррекции времени')},
        {code: 'Е-48', desc: translate('Напряжение батареи менее 2,65 В')}
    ]
};

getArraysMonthCmd1();
getArraysMonthCmd2();
module.exports.options = options;

const variant = {
    1: {
        1: {0: '5', 1: '1', 2: '10'},
        2: {0: '57,7', 1: '230'},
        3: {0: '0,2', 1: '0,5', 2: '1,0', 3: '2,0'},
        4: {0: '0.2S', 1: '0.5S', 2: '1.0', 3: '2.0'}
    },
    2: {
        1: {
            0: '5000 imp/1kW',
            1: '25000 imp/1kW',
            2: '1250 imp/1kW',
            3: '500 imp/1kW',
            4: '1000 imp/1kW',
            5: '250 imp/1kW'
        },
        2: {0: '3', 1: '1'},
        3: {0: 'no', 1: 'yes'},
        4: {0: '-20', 1: '-40'},
        5: {0: '2', 1: '1'}
    },
    3: {
        1: {0: ''},
        2: {0: 'AR', 1: 'A'},
        3: {0: 'outline', 1: 'inline'},
        4: {0: 'с учетом знака', 1: 'по модулю'}
    },
    4: {
        1: {0: 'no', 1: 'yes'},
        2: {0: 'no', 1: 'yes'},
        3: {0: 'CAN', 1: 'RS485', 2: 'reserv', 3: 'no'},
        4: {0: 'no', 1: 'yes'},
        5: {0: 'no', 1: 'yes'},
        6: {0: 'no', 1: 'yes'},
        7: {0: '524kB', 1: '1048kB'}
    },
    5: {
        1: {0: 'no', 1: 'yes'},
        2: {0: 'no', 1: 'yes'},
        3: {0: 'no', 1: 'yes'},
        4: {0: 'no', 1: 'yes'},
        5: {0: 'no', 1: 'yes'},
        6: {0: 'no', 1: 'yes'},
        7: {0: 'no', 1: 'yes'},
        8: {0: 'no', 1: 'yes'}
    },
    6: {
        1: {0: 'no', 1: 'yes'},
        2: {0: 'no', 1: 'yes'},
        3: {0: 'no', 1: 'yes'},
        4: {0: 'no', 1: 'yes'},
        5: {0: 'no', 1: 'yes'},
        6: {0: 'no', 1: 'yes'},
        7: {0: 'no', 1: 'yes'},
        8: {0: 'no', 1: 'yes'}
    }
};

function getArraysMonthCmd1(){
    for (let month = 1; month <= 12; month++) {
        const _month = parseInt(month - 1, 'hex');
        options.protocol['1'].first.push({
            code: 0x32,
            cmd:  [_month],
            desc: 'Чтение накопленной энергии за ' + month + ' месяц',
            func: ff.month12Energy
        });
    }
}

function getArraysMonthCmd2(){
    const date = new Date();
    for (let month = 1; month <= 12; month++) {
        for (let tariff = 0; tariff <= 4; tariff++) {
            const _month = parseInt(48 + month, 'hex');
            const _tariff = parseInt(tariff, 'hex');
            options.protocol['2'].first.push({
                code: 0x05,
                cmd:  [_month, _tariff],
                desc: 'Чтение накопленной энергии за ' + month + ' месяц',
                func: f.month12Energy
            });
            if (month === date.getMonth() + 1){
                options.protocol['2'].poll.push({
                    code: 0x05,
                    cmd:  [_month, _tariff],
                    desc: 'Чтение накопленной энергии за текущий месяц, ' + tariff ? 'тариф - ' + tariff :'общая',
                    func: f.month12Energy
                });
            }
        }
    }
}

function getThree16LE(response, divider){
    divider = divider || 1;
    return {
        one:   parseFloat(((Buffer.from([response[2], response[3]]).readUInt16LE(0)) / divider).toFixed(2)),
        two:   parseFloat(((Buffer.from([response[5], response[6]]).readUInt16LE(0)) / divider).toFixed(2)),
        three: parseFloat(((Buffer.from([response[8], response[9]]).readUInt16LE(0)) / divider).toFixed(2))
    };
}

function getPowerFour32LE(response, divider){
    divider = divider || 1;
    return {
        one:   parseFloat(((Buffer.from([response[2], response[3], response[1] & 0x3F, 0]).readInt32LE(0)) / divider).toFixed(2)),
        two:   parseFloat(((Buffer.from([response[5], response[6], response[4] & 0x3F, 0]).readInt32LE(0)) / divider).toFixed(2)),
        three: parseFloat(((Buffer.from([response[8], response[9], response[7] & 0x3F, 0]).readInt32LE(0)) / divider).toFixed(2)),
        four:  parseFloat(((Buffer.from([response[11], response[12], response[10] & 0x3F, 0]).readInt32LE(0)) / divider).toFixed(2))
    };
}

function getFour16LE(response, divider){
    divider = divider || 1;
    return {
        one:   parseFloat(((Buffer.from([response[2], response[3]]).readInt16LE(0)) / divider).toFixed(2)),
        two:   parseFloat(((Buffer.from([response[5], response[6]]).readInt16LE(0)) / divider).toFixed(2)),
        three: parseFloat(((Buffer.from([response[8], response[9]]).readInt16LE(0)) / divider).toFixed(2)),
        four:  parseFloat(((Buffer.from([response[11], response[12]]).readInt16LE(0)) / divider).toFixed(2))
    };
}

function getFour32LE(response, divider){
    divider = divider || 1;
    return {
        one:   parseFloat(((Buffer.concat([response.slice(3, 5), response.slice(1, 3)]).readInt32LE(0)) / divider).toFixed(2)),
        two:   parseFloat(((Buffer.concat([response.slice(7, 9), response.slice(5, 7)]).readInt32LE(0)) / divider).toFixed(2)),
        three: parseFloat(((Buffer.concat([response.slice(11, 13), response.slice(9, 11)]).readInt32LE(0)) / divider).toFixed(2)),
        four:  parseFloat(((Buffer.concat([response.slice(15, 17), response.slice(13, 15)]).readInt32LE(0)) / divider).toFixed(2))
    };
}

const getVariant = function (byte, bit, val){
    return variant[byte][bit][val];
};

function parseDate(dd, mm, yy){
    return (dd.toString(16) < 10 ? '0' :'') + dd.toString(16) + '.' + (mm.toString(16) < 10 ? '0' :'') + mm.toString(16) + '.' + '20' + (yy.toString(16) < 10 ? '0' :'') + yy.toString(16);
}

function parseTime(hh, mm, ss){
    return (hh.toString(16) < 10 ? '0' :'') + hh.toString(16) + ':' + (mm.toString(16) < 10 ? '0' :'') + mm.toString(16) + ':' + (ss.toString(16) < 10 ? '0' :'') + ss.toString(16);
}

function parseEnergy(res, devider){
    devider = devider || 1;
    return {
        t1: parseInt(zeroConcat(res[5]) + zeroConcat(res[6]) + zeroConcat(res[7]) + zeroConcat(res[8])) / devider,
        t2: parseInt(zeroConcat(res[9]) + zeroConcat(res[10]) + zeroConcat(res[11]) + zeroConcat(res[12])) / devider,
        t3: parseInt(zeroConcat(res[13]) + zeroConcat(res[14]) + zeroConcat(res[15]) + zeroConcat(res[16])) / devider,
        t4: parseInt(zeroConcat(res[17]) + zeroConcat(res[18]) + zeroConcat(res[19]) + zeroConcat(res[20])) / devider
    };
}

const zeroConcat = (h) => {
    return parseInt(h.toString(16)) < 10 ? ('0' + h.toString(16)) :h.toString(16);
};

const getMonth = function (){
    const date = new Date();
    return ('0' + (date.getMonth() + 1)).slice(-2);
};

/*function currentMonth(){
    const date = new Date();
    return [parseInt(date.getMonth(), 'hex')];
}

const getMonthCmd = function (){
    const date = new Date();
    return parseInt(48 + date.getMonth() + 1, 'hex');
};*/

module.exports.crc = function (buffer){
    let crc = 0xFFFF, odd;
    for (let i = 0; i < buffer.length; i++) {
        crc = crc ^ buffer[i];
        for (let j = 0; j < 8; j++) {
            odd = crc & 0x0001;
            crc = crc >> 1;
            if (odd){
                crc = crc ^ 0xA001;
            }
        }
    }
    return crc;
};
module.exports.toHexString = (byteArray) => {
    return Array.from(byteArray, (byte) => {
        return ('0' + (byte).toString(16)).slice(-2).toUpperCase();
    }).join(' ');
};

