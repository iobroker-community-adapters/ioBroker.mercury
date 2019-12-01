'use strict';

module.exports.template = {
    1: {
        conf:     {
            model:    {val: null, name: '', desc: 'model'},
            name:     {val: '', desc: 'name'},
            addr:     {val: null, desc: 'address'},
            protocol: {val: null, desc: 'protocol'}
        },
        info:     {
            location: {val: '', desc: 'Location'},
            sn:       {val: null, desc: 'Serial number'},
            dateProd: {val: '', desc: 'Production date'},
            firmware: {val: '', desc: 'Software version'}
        },
        metering: {
            totalEnergy: {val: null, desc: 'Общая энергия'}
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
                    T1:    {val: null, desc: 'Энергия за текущий месяц по тарифу 1'},
                    T2:    {val: null, desc: 'Энергия за текущий месяц по тарифу 2'},
                    T3:    {val: null, desc: 'Энергия за текущий месяц по тарифу 3'},
                    T4:    {val: null, desc: 'Энергия за текущий месяц по тарифу 4'},
                    Total: {val: null, desc: 'Энергия за текущий месяц Итого'}
                }
            }
        }
    }
};

function setDevState(device, index, param){ //TODO переписать
    const arr = param.name.split('.');
    const obj = {val: param.val, desc: param.desc ? param.desc :arr[arr.length - 1]};
    if (arr.length > 2) return device;
    for (let i = 0; i < arr.length; i++) {
        if (i === 0 && !device[index][arr[0]]){
            device[index][arr[0]] = {};
            if (arr.length - 1 === i){
                device[index][arr[0]] = obj;
            }
        } else if (i === 0 && device[index][arr[0]].val){
            device[index][arr[0]].val = param.val;
        }
        if (i === 1 && !device[index][arr[0]][arr[1]]){
            device[index][arr[0]][arr[1]] = {};
            if (arr.length - 1 === i){
                device[index][arr[0]][arr[1]] = obj;
            }
        } else if (i === 1 && device[index][arr[0]][arr[1]].val){
            device[index][arr[0]][arr[1]].val = param.val;
        }
        if (i === 2 && !device[index][arr[0]][arr[1]][arr[2]]){
            device[index][arr[0]][arr[1]][arr[2]] = {};
            if (arr.length - 1 === i){
                device[index][arr[0]][arr[1]][arr[2]] = obj;
            }
        } else if (i === 2 && device[index][arr[0]][arr[1]][arr[2]].val){
            device[index][arr[0]][arr[1]][arr[2]].val = param.val;
        }
    }
    return device;
}

var ff = {
    dateProd:    function (device, index, cmd, response){
        console.log('readSnAndDate - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        setDevState(device, index, {
            name: 'info.dateProd',
            desc: 'Production date',
            val:  0
        });
        return device;
    },
    totalEnergy: function (device, index, cmd, response){
        console.log('totalEnergy - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        setDevState(device, index, {name: 'metering.totalEnergy', desc: 'DESC', val: 0});
        return device;
    }
};

/* 
 setDevState(device, index, {name: 'metering.NAME', desc: 'DESC', val: VAL });
*/

var f = {
    readSnAndDate:    function (device, index, cmd, response){
        console.log('readSnAndDate - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        setDevState(device, index, {
            name: 'info.sn',
            desc: 'Serial number',
            val:  parseInt(response.slice(1, 5).join(''))
        });
        setDevState(device, index, {
            name: 'info.dateProd',
            desc: 'Production date',
            val:  (parseInt(response[5]) < 10 ? '0' :'') + response[5] + '.' + (parseInt(response[6]) < 10 ? '0' :'') + response[6] + '.' + '20' + response[7]
        });
        return device;
    },
    firmwareVersion:  function (device, index, cmd, response){
        console.log('firmwareVersion - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        setDevState(device, index, {
            name: 'info.firmware',
            desc: 'Software version',
            val:  response.slice(1, 4).join('.')
        });
        return device;
    },
    crcDevice:        function (device, index, cmd, response){
        console.log('crcDevice - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        setDevState(device, index, {
            name: 'info.crcDevice',
            desc: 'CRC16 software',
            val:  response.slice(1, 3).toString('hex').toUpperCase()
        });
        return device;
    },
    variantExecution: function (device, index, cmd, response){
        console.log('variantExecution - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        //1
        setDevState(device, index, {
            name: 'info.classEnergyA',
            desc: 'Energy Class A+',
            val:  getVariant(1, 4, (response[1] >> 6) & 3)
        });
        setDevState(device, index, {
            name: 'info.classEnergyR',
            desc: 'Energy Class R+',
            val:  getVariant(1, 3, (response[1] >> 4) & 3)
        });
        setDevState(device, index, {
            name: 'info.nomU',
            desc: 'Rated voltage',
            val:  getVariant(1, 2, (response[1] >> 2) & 3)
        });
        setDevState(device, index, {
            name: 'info.nomI',
            desc: 'Rated current',
            val:  getVariant(1, 1, (response[1] >> 0) & 3)
        });
        //2
        setDevState(device, index, {
            name: 'info.dest',
            desc: 'Number of destinations',
            val:  getVariant(2, 5, (response[2] >> 7) & 1)
        });
        setDevState(device, index, {
            name: 'info.temperature',
            desc: 'Temperature Range',
            val:  getVariant(2, 4, (response[2] >> 6) & 1)
        });
        setDevState(device, index, {
            name: 'info.mediumPowerProfile',
            desc: 'Medium Capacity Profile capacities',
            val:  getVariant(2, 3, (response[2] >> 5) & 1)
        });
        setDevState(device, index, {
            name: 'info.numPhases',
            desc: 'Number of phases',
            val:  getVariant(2, 2, (response[2] >> 4) & 1)
        });
        setDevState(device, index, {
            name: 'info.counterConst',
            desc: 'Counter constant',
            val:  getVariant(2, 1, (response[2] >> 0) & 15)
        });
        //3
        setDevState(device, index, {
            name: 'info.SummPhases',
            desc: 'Phase Summation',
            val:  getVariant(3, 4, (response[3] >> 7) & 1)
        });
        setDevState(device, index, {
            name: 'info.Tarifficator',
            desc: 'Tariff',
            val:  getVariant(3, 3, (response[3] >> 6) & 1)
        });
        setDevState(device, index, {
            name: 'info.typeCount',
            desc: 'Counter type',
            val:  getVariant(3, 2, (response[3] >> 4) & 3)
        });
        setDevState(device, index, {
            name: 'info.executionOption',
            desc: 'Execution option',
            val:  parseInt((response[3] >> 0) & 15)
        });
        //4
        setDevState(device, index, {
            name: 'info.memSize',
            desc: 'Memory',
            val:  getVariant(4, 7, (response[4] >> 7) & 1)
        });
        setDevState(device, index, {
            name: 'info.intPlm',
            desc: 'Built-in PLM Modem',
            val:  getVariant(4, 6, (response[4] >> 6) & 1)
        });
        setDevState(device, index, {
            name: 'info.intGsm',
            desc: 'Built-in GSM Modem',
            val:  getVariant(4, 5, (response[4] >> 5) & 1)
        });
        setDevState(device, index, {
            name: 'info.ir',
            desc: 'Optical port',
            val:  getVariant(4, 4, (response[4] >> 4) & 1)
        });
        setDevState(device, index, {
            name: 'info.interface',
            desc: 'Interface type',
            val:  getVariant(4, 3, (response[4] >> 2) & 3)
        });
        setDevState(device, index, {
            name: 'info.extPower',
            desc: 'External power',
            val:  getVariant(4, 2, (response[4] >> 1) & 1)
        });
        setDevState(device, index, {
            name: 'info.elecSealTopCover',
            desc: 'Top Seal Electronic Seal',
            val:  getVariant(4, 1, (response[4] >> 0) & 1)
        });
        //5
        setDevState(device, index, {
            name: 'info.internalRelay',
            desc: 'Built-in load shedding relay',
            val:  getVariant(5, 8, (response[5] >> 7) & 1)
        });
        setDevState(device, index, {
            name: 'info.backlightDisp',
            desc: 'LCD backlight',
            val:  getVariant(5, 7, (response[5] >> 7) & 1)
        });
        setDevState(device, index, {
            name: 'info.tariffMeteringOfMaxPower',
            desc: 'Tariff metering of maximum power',
            val:  getVariant(6, 5, (response[5] >> 7) & 1)
        });
        setDevState(device, index, {
            name: 'info.elecSealCover',
            desc: 'Electronic seal of protective cover',
            val:  getVariant(5, 5, (response[5] >> 7) & 1)
        });
        setDevState(device, index, {
            name: 'info.interface2',
            desc: 'Interface2',
            val:  getVariant(5, 4, (response[5] >> 7) & 1)
        });
        setDevState(device, index, {
            name: 'info.intPower',
            desc: 'Built-in Power Interface1',
            val:  getVariant(5, 3, (response[5] >> 7) & 1)
        });
        setDevState(device, index, {
            name: 'info.controlPke',
            desc: 'PCE control',
            val:  getVariant(5, 2, (response[5] >> 7) & 1)
        });
        setDevState(device, index, {
            name: 'info.phaseMeteringEnergyA',
            desc: 'Phase energy metering A+',
            val:  getVariant(5, 1, (response[5] >> 7) & 1)
        });
        //6
        setDevState(device, index, {
            name: 'info.internalPlc2',
            desc: 'Integrated PLC2 Modem',
            val:  getVariant(6, 5, (response[6] >> 4) & 1)
        });
        setDevState(device, index, {
            name: 'info.profile2',
            desc: 'Profile2',
            val:  getVariant(6, 4, (response[6] >> 3) & 1)
        });
        setDevState(device, index, {
            name: 'info.electronicSealModuleBay',
            desc: 'Modular compartment electronic seal',
            val:  getVariant(6, 3, (response[6] >> 2) & 1)
        });
        setDevState(device, index, {
            name: 'info.externalVoltageTariffSwitch',
            desc: 'Tariff switching by external voltage',
            val:  getVariant(6, 2, (response[6] >> 1) & 1)
        });
        return device;
    },
    readLocation:     function (device, index, cmd, response){
        console.log('readLocation - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        setDevState(device, index, {name: 'info.location', desc: 'Location', val: response.toString('ascii', 1, 5)});
        return device;
    },
    transformRatio:   function (device, index, cmd, response){
        console.log('transformRatio - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        setDevState(device, index, {
            name: 'info.voltageTransformationRatio',
            desc: 'Voltage transformation ratio',
            val:  response.readInt16BE(1)
        });
        setDevState(device, index, {
            name: 'info.currentTransformationRatio',
            desc: 'Current transformer ratio',
            val:  response.readInt16BE(3)
        });
        return device;
    },
    totalEnergy:      function (device, index, cmd, response){
        console.log('totalEnergy - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        if (response.length === 19){
            const {one, two, three, four} = getFour32LE(response, 1000);
            setDevState(device, index, {
                name: 'metering.totalEnergyActivePlus',
                desc: 'totalEnergyActivePlus',
                val:  one
            });
            setDevState(device, index, {
                name: 'metering.totalEnergyActiveMinus',
                desc: 'totalEnergyActiveMinus',
                val:  two
            });
            setDevState(device, index, {
                name: 'metering.totalEnergyReactivePlus',
                desc: 'totalEnergyReactivePlus',
                val:  three
            });
            setDevState(device, index, {
                name: 'metering.totalEnergyReactiveMinus',
                desc: 'totalEnergyReactiveMinus',
                val:  four
            });
            setDevState(device, index, {
                name: 'metering.totalEnergy',
                desc: 'totalEnergy',
                val:  parseFloat((one + two + three + four).toFixed(2))
            });
            /*device[index].metering.totalEnergyActivePlus.val = one;
            device[index].metering.totalEnergyActiveMinus.val = two;
            device[index].metering.totalEnergyReactivePlus.val = three;
            device[index].metering.totalEnergyReactiveMinus.val = four;
            device[index].metering.totalEnergy.val = one + two + three + four;*/
        }
        return device;
    },
    currentDayEnergy: function (device, index, cmd, response){
        console.log('currentDayEnergy - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        if (response.length === 19){
            const {one, two, three, four} = getFour32LE(response, 1000);
            setDevState(device, index, {
                name: 'metering.currentDayEnergyActivePlus',
                desc: 'currentDayEnergyActivePlus',
                val:  one
            });
            setDevState(device, index, {
                name: 'metering.currentDayEnergyActiveMinus',
                desc: 'currentDayEnergyActiveMinus',
                val:  two
            });
            setDevState(device, index, {
                name: 'metering.currentDayEnergyReactivePlus',
                desc: 'currentDayEnergyReactivePlus',
                val:  three
            });
            setDevState(device, index, {
                name: 'metering.currentDayEnergyReactiveMinus',
                desc: 'currentDayEnergyReactiveMinus',
                val:  four
            });
            setDevState(device, index, {
                name: 'metering.currentDayEnergyTotal',
                desc: 'currentDayEnergyTotal',
                val:  one + two + three + four
            });
            /* device[index].metering.currentDayEnergyActivePlus.val = one;
             device[index].metering.currentDayEnergyActiveMinus.val = two;
             device[index].metering.currentDayEnergyReactivePlus.val = three;
             device[index].metering.currentDayEnergyReactiveMinus.val = four;
             device[index].metering.currentDayEnergyTotal.val = one + two + three + four;*/
        }
        return device;
    },
    oneTarrif:        function (device, index, cmd, response){
        console.log('oneTarrif - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        if (response.length === 19){
            const {one, two, three, four} = getFour32LE(response, 1000);
            setDevState(device, index, {
                name: 'metering.oneTarrifEnergyActivePlus',
                desc: 'oneTarrifEnergyActivePlus',
                val:  one
            });
            setDevState(device, index, {
                name: 'metering.oneTarrifEnergyActiveMinus',
                desc: 'oneTarrifEnergyActiveMinus',
                val:  two
            });
            setDevState(device, index, {
                name: 'metering.oneTarrifEnergyReactivePlus',
                desc: 'oneTarrifEnergyReactivePlus',
                val:  three
            });
            setDevState(device, index, {
                name: 'metering.oneTarrifEnergyReactiveMinus',
                desc: 'oneTarrifEnergyReactiveMinus',
                val:  four
            });
            setDevState(device, index, {
                name: 'metering.oneTarrifEnergyTotal',
                desc: 'oneTarrifEnergyTotal',
                val:  parseFloat((one + two + three + four).toFixed(2))
            });
            /* device[index].metering.oneTarrifEnergyActivePlus.val = one;
             device[index].metering.oneTarrifEnergyActiveMinus.val = two;
             device[index].metering.oneTarrifEnergyReactivePlus.val = three;
             device[index].metering.oneTarrifEnergyReactiveMinus.val = four;
             device[index].metering.oneTarrifEnergyTotal.val = one + two + three + four;*/
        }
        return device;
    },
    twoTarrif:        function (device, index, cmd, response){
        console.log('twoTarrif - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        if (response.length === 19){
            const {one, two, three, four} = getFour32LE(response, 1000);
            setDevState(device, index, {
                name: 'metering.twoTarrifEnergyActivePlus',
                desc: 'twoTarrifEnergyActivePlus',
                val:  one
            });
            setDevState(device, index, {
                name: 'metering.twoTarrifEnergyActiveMinus',
                desc: 'twoTarrifEnergyActiveMinus',
                val:  two
            });
            setDevState(device, index, {
                name: 'metering.twoTarrifEnergyReactivePlus',
                desc: 'twoTarrifEnergyReactivePlus',
                val:  three
            });
            setDevState(device, index, {
                name: 'metering.twoTarrifEnergyReactiveMinus',
                desc: 'twoTarrifEnergyReactiveMinus',
                val:  four
            });
            setDevState(device, index, {
                name: 'metering.twoTarrifEnergyTotal',
                desc: 'twoTarrifEnergyTotal',
                val:  parseFloat((one + two + three + four).toFixed(2))
            });
            /*device[index].metering.twoTarrifEnergyActivePlus.val = one;
            device[index].metering.twoTarrifEnergyActiveMinus.val = two;
            device[index].metering.twoTarrifEnergyReactivePlus.val = three;
            device[index].metering.twoTarrifEnergyReactiveMinus.val = four;
            device[index].metering.twoTarrifEnergyTotal.val = one + two + three + four;*/
        }
        return device;
    },
    threeTarrif:      function (device, index, cmd, response){
        console.log('threeTarrif - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        if (response.length === 19){
            const {one, two, three, four} = getFour32LE(response, 1000);
            setDevState(device, index, {
                name: 'metering.threeTarrifEnergyActivePlus',
                desc: 'threeTarrifEnergyActivePlus',
                val:  one
            });
            setDevState(device, index, {
                name: 'metering.threeTarrifEnergyActiveMinus',
                desc: 'threeTarrifEnergyActiveMinus',
                val:  two
            });
            setDevState(device, index, {
                name: 'metering.threeTarrifEnergyReactivePlus',
                desc: 'threeTarrifEnergyReactivePlus',
                val:  three
            });
            setDevState(device, index, {
                name: 'metering.threeTarrifEnergyReactiveMinus',
                desc: 'threeTarrifEnergyReactiveMinus',
                val:  four
            });
            setDevState(device, index, {
                name: 'metering.threeTarrifEnergyTotal',
                desc: 'threeTarrifEnergyTotal',
                val:  parseFloat((one + two + three + four).toFixed(2))
            });
            /*device[index].metering.threeTarrifEnergyActivePlus.val = one;
            device[index].metering.threeTarrifEnergyActiveMinus.val = two;
            device[index].metering.threeTarrifEnergyReactivePlus.val = three;
            device[index].metering.threeTarrifEnergyReactiveMinus.val = four;
            device[index].metering.threeTarrifEnergyTotal.val = one + two + three + four;*/
        }
        return device;
    },
    fourTarrif:       function (device, index, cmd, response){
        console.log('fourTarrif - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        if (response.length === 19){
            const {one, two, three, four} = getFour32LE(response, 1000);
            setDevState(device, index, {
                name: 'metering.fourTarrifEnergyActivePlus',
                desc: 'fourTarrifEnergyActivePlus',
                val:  one
            });
            setDevState(device, index, {
                name: 'metering.fourTarrifEnergyActiveMinus',
                desc: 'fourTarrifEnergyActiveMinus',
                val:  two
            });
            setDevState(device, index, {
                name: 'metering.fourTarrifEnergyReactivePlus',
                desc: 'fourTarrifEnergyReactivePlus',
                val:  three
            });
            setDevState(device, index, {
                name: 'metering.fourTarrifEnergyReactiveMinus',
                desc: 'fourTarrifEnergyReactiveMinus',
                val:  four
            });
            setDevState(device, index, {
                name: 'metering.fourTarrifEnergyTotal',
                desc: 'fourTarrifEnergyTotal',
                val:  parseFloat((one + two + three + four).toFixed(2))
            });
            /*device[index].metering.fourTarrifEnergyActivePlus.val = one;
            device[index].metering.fourTarrifEnergyActiveMinus.val = two;
            device[index].metering.fourTarrifEnergyReactivePlus.val = three;
            device[index].metering.fourTarrifEnergyReactiveMinus.val = four;
            device[index].metering.fourTarrifEnergyTotal.val = one + two + three + four;*/
        }
        return device;
    },
    powerPhase:       function (device, index, cmd, response){
        console.log('powerPhase - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        if (response.length === 15){
            const {one, two, three, four} = getFour32BE(response, 100);
            setDevState(device, index, {name: 'metering.powerTotal', desc: 'powerTotal', val: one});
            setDevState(device, index, {name: 'metering.powerPhase1', desc: 'powerPhase1', val: two});
            setDevState(device, index, {name: 'metering.powerPhase2', desc: 'powerPhase2', val: three});
            setDevState(device, index, {name: 'metering.powerPhase3', desc: 'powerPhase3', val: four});
            /*device[index].metering.powerTotal.val = one;
            device[index].metering.powerPhase1.val = two;
            device[index].metering.powerPhase2.val = three;
            device[index].metering.powerPhase3.val = four;*/
        }
        return device;
    },
    voltagePhase:     function (device, index, cmd, response){
        console.log('voltagePhase - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        if (response.length === 12){
            const {one, two, three} = getThree32BE(response, 100);
            setDevState(device, index, {name: 'metering.voltagePhase1', desc: 'voltagePhase1', val: one});
            setDevState(device, index, {name: 'metering.voltagePhase2', desc: 'voltagePhase2', val: two});
            setDevState(device, index, {name: 'metering.voltagePhase3', desc: 'voltagePhase3', val: three});
            /*device[index].metering.voltagePhase1.val = one;
            device[index].metering.voltagePhase2.val = two;
            device[index].metering.voltagePhase3.val = three;*/
        }
        return device;
    },
    currentPhase:     function (device, index, cmd, response){
        console.log('currentPhase - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        if (response.length === 12){
            const {one, two, three} = getThree32BE(response, 1000);
            setDevState(device, index, {name: 'metering.currentPhase1', desc: 'currentPhase1', val: one});
            setDevState(device, index, {name: 'metering.currentPhase2', desc: 'currentPhase2', val: two});
            setDevState(device, index, {name: 'metering.currentPhase3', desc: 'currentPhase3', val: three});
            /*device[index].metering.currentPhase1.val = one;
            device[index].metering.currentPhase2.val = two;
            device[index].metering.currentPhase3.val = three;*/
        }
        return device;
    },
    cosf:             function (device, index, cmd, response){
        console.log('cosf - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        if (response.length === 15){
            const {one, two, three, four} = getFour32BE(response, 1000);
            console.log('cosf - one: ' + one + ' two: ' + two + ' three: ' + three + ' four: ' + four);
            setDevState(device, index, {name: 'metering.cosfTotal', desc: 'cosfTotal', val: one});
            setDevState(device, index, {name: 'metering.cosfPhase1', desc: 'cosfPhase1', val: two});
            setDevState(device, index, {name: 'metering.cosfPhase2', desc: 'cosfPhase2', val: three});
            setDevState(device, index, {name: 'metering.cosfPhase3', desc: 'cosfPhase3', val: four});
            /*device[index].metering.cosfTotal.val = one;
            device[index].metering.cosfPhase1.val = two;
            device[index].metering.cosfPhase2.val = three;
            device[index].metering.cosfPhase3.val = four;*/
        }
        return device;
    },
    yearEnergy:       function (device, index, cmd, response){
        console.log('yearEnergy - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        if (response.length === 19){
            const {one, two, three, four} = getFour32LE(response, 1000);
            setDevState(device, index, {
                name: 'metering.currentYearEnergyActivePlus',
                desc: 'currentYearEnergyActivePlus',
                val:  one
            });
            setDevState(device, index, {
                name: 'metering.currentYearEnergyActiveMinus',
                desc: 'currentYearEnergyActiveMinus',
                val:  two
            });
            setDevState(device, index, {
                name: 'metering.currentYearEnergyReactivePlus',
                desc: 'currentYearEnergyReactivePlus',
                val:  three
            });
            setDevState(device, index, {
                name: 'metering.currentYearEnergyReactiveMinus',
                desc: 'currentYearEnergyReactiveMinus',
                val:  four
            });
            setDevState(device, index, {
                name: 'metering.currentYearEnergyTotal',
                desc: 'currentYearEnergyTotal',
                val:  parseFloat((one + two + three + four).toFixed(2))
            });
            /* device[index].metering.currentYearEnergyActivePlus.val = one;
             device[index].metering.currentYearEnergyActiveMinus.val = two;
             device[index].metering.currentYearEnergyReactivePlus.val = three;
             device[index].metering.currentYearEnergyReactiveMinus.val = four;
             device[index].metering.currentYearEnergyTotal.val = one + two + three + four;*/
        }
        return device;
    },
    month12Energy:    function (device, index, cmd, response){
        console.log('monthEnergy - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response) + ' lenght: ' + response.length);
        if (response.length === 19){
            const month = ('0' + (parseInt(cmd[2] - 0x30, 10))).slice(-2);
            if (device[index].metering.EnergyMonth[month] === undefined){
                device[index].metering.EnergyMonth[month] = {
                    T1:    {val: null, desc: 'Энергия по тарифу 1'},
                    T2:    {val: null, desc: 'Энергия по тарифу 2'},
                    T3:    {val: null, desc: 'Энергия по тарифу 3'},
                    T4:    {val: null, desc: 'Энергия по тарифу 4'},
                    Total: {val: null, desc: 'Энергия Итого'}
                };
            }
            const {one, two, three, four} = getFour32LE(response, 1000);
            let ttl = parseFloat((one + two + three + four).toFixed(2));
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
        return device;
    },
    acceleratedMode: function (device, index, cmd, response){
        console.log('acceleratedMode - index: ' + JSON.stringify(index) + ' response: ' + JSON.stringify(response));
    }
};

let options = {
    protocol: {
        1: {
            readinfo: [ //чтение инфы о счетчике
                /*{code: 0x28, cmd: [], desc: 'Чтение идентификационных данных счетчика', func: ff.identCounter},
                {code: 0x2d, cmd: [], desc: 'Чтение функции выходного оптрона', func: ff.optronFunc},
                {code: 0x65, cmd: [], desc: 'Чтение слова исполнения', func: ff.variantEx},*/
                {code: 0x66, cmd: [], desc: 'Чтение даты изготовления', func: ff.dateMake}
            ],
            first:    [// параметры читаемые один раз при запуске драйвера

            ],
            poll:     [
                {code: 0x05, cmd: [0x00, 0x00], desc: 'Чтение накопленной энергии от сброса', func: ff.totalEnergy},
            ],
            read:     [
                {cmd: 0x20, desc: 'Чтение группового адреса счетчика'},
                {cmd: 0x21, desc: 'Чтение внутренних часов и календаря счетчика'},
                {cmd: 0x22, desc: 'Чтение лимита мощности'},
                {cmd: 0x23, desc: 'Чтение лимита энергии за месяц'},
                {cmd: 0x24, desc: 'Чтение флага сезонного времени '},
                {cmd: 0x25, desc: 'Чтение величины коррекции времени '},
                {cmd: 0x26, desc: 'Чтение текущей мощности в нагрузке'},
                {cmd: 0x27, desc: 'Чтение содержимого тарифных аккумуляторов активной энергии'},
                {cmd: 0x29, desc: 'Чтение напряжения на литиевой батарее'},
                {cmd: 0x2A, desc: 'Чтение режима индикации'},
                {cmd: 0x2B, desc: 'Чтение времени последнего отключения напряжения'},
                {cmd: 0x2C, desc: 'Чтение времени последнего включения напряжения'},
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
                    desc: 'Чтение коэффициента  коррекции хода часов Введена для чтения коэффициента коррекции без перемычки'
                },
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
                {code: 0x05, cmd: [0x40, 0x00], desc: 'Чтение енергии за текущие сутки', func: f.currentDayEnergy},
                {code: 0x05, cmd: [0x00, 0x01], desc: 'Чтение энергия по 1 тарифу', func: f.oneTarrif},
                {code: 0x05, cmd: [0x00, 0x02], desc: 'Чтение энергия по 2 тарифу', func: f.twoTarrif},
                {code: 0x05, cmd: [0x00, 0x03], desc: 'Чтение энергия по 3 тарифу', func: f.threeTarrif},
                {code: 0x05, cmd: [0x00, 0x04], desc: 'Чтение энергия по 4 тарифу', func: f.fourTarrif},
                {code: 0x08, cmd: [0x16, 0x00], desc: 'Мощность по фазам', func: f.powerPhase},
                {code: 0x08, cmd: [0x16, 0x11], desc: 'Напряжение по фазам', func: f.voltagePhase},
                {code: 0x08, cmd: [0x16, 0x21], desc: 'Ток по фазам', func: f.currentPhase},
                {code: 0x08, cmd: [0x16, 0x30], desc: 'Коэффициент мощности по фазам', func: f.cosf}
            ],
            read:     [
                {cmd: 0x01, desc: 'Ускоренный режим чтения индивидуальных параметров прибора', func: f.acceleratedMode},
                {cmd: 0x04, desc: 'Чтение множителя таймаута дополнительного интерфейса', func: f.timeoutInterface2},
                {cmd: 0x06, desc: 'Чтение режимов индикации', func: f.indicationMode},
                {cmd: 0x07, desc: 'Чтение значений времен перехода на летнее и зимнее время', func: f.timeSummerWinter},
                {
                    cmd:  0x08,
                    desc: 'Чтение времени контроля за превышением лимита мощностии параметров автовключения реле',
                    func: f.timeLimitPRele
                },
                {cmd: 0x09, desc: 'Чтение программируемых флагов', func: f.programFlag},
                {cmd: 0x0A, desc: 'Чтение байт состояния', func: f.statusByte},
                {
                    cmd:  0x0C,
                    desc: 'Чтение расписания утренних и вечерних максимумов мощности',
                    func: f.timeMorningEveningMax
                },
                {
                    cmd:  0x0D,
                    desc: 'Чтение значений утренних и вечерних максимумов мощности',
                    func: f.valueMorningEveningMax
                },
                {
                    cmd:  0x11,
                    desc: 'Чтение вспомогательных параметров: мгновенной активной, реактивной, полной мощности, фазных и линейных напряжений, тока, коэффициента мощности, частоты и небаланса',
                    func: f.moreParam
                },

                {
                    cmd:  0x13,
                    desc: 'Чтение параметров последней записи основного массива средних мощностей',
                    func: f.lastArrPower
                },
                {cmd: 0x14, desc: 'Чтение зафиксированных данных', func: f.recordedData},
                {
                    cmd:  0x15,
                    desc: 'Чтение параметров последней записи дополнительного массива средних мощностей',
                    func: f.lastMoreArrPower
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
                    desc: 'Чтение параметров индикации счетчика (по индицируемым тарифам)',
                    func: f.paramIndicatorTariff
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
                    cmd:  0x21,
                    desc: 'Чтение времени выхода/возврата за мин.нормально допустимое значение напряжения в фазе 1'
                },
                {
                    cmd:  0x22,
                    desc: 'Чтение времени выхода/возврата за макс. нормально допустимое значение напряжения в фазе 1'
                },
                {
                    cmd:  0x23,
                    desc: 'Чтение времени выхода/возврата за макс. предельно допустимое значение напряжения в фазе 1'
                },
                {
                    cmd:  0x24,
                    desc: 'Чтение времени выхода/возврата за мин.предельно допустимое значение напряжения в фазе 2'
                },
                {
                    cmd:  0x25,
                    desc: 'Чтение времени выхода/возврата за мин.нормально допустимое значение напряжения в фазе 2'
                },
                {
                    cmd:  0x26,
                    desc: 'Чтение времени выхода/возврата за макс. нормально допустимое значение напряжения в фазе 2'
                },
                {
                    cmd:  0x27,
                    desc: 'Чтение времени выхода/возврата за макс. предельно допустимое значение напряжения в фазе 2'
                },
                {
                    cmd:  0x28,
                    desc: 'Чтение времени выхода/возврата за мин.предельно допустимое значе-ние напряжения в фазе 3'
                },
                {
                    cmd:  0x29,
                    desc: 'Чтение времени выхода/возврата за мин.нормально допустимое значе-ние напряжения в фазе 3'
                },
                {
                    cmd:  0x2A,
                    desc: 'Чтение времени выхода/возврата за макс. нормально допустимое значе-ние напряжения в фазе 3'
                },
                {
                    cmd:  0x2B,
                    desc: 'Чтение времени выхода/возврата за макс. предельно допустимое значе-ние напряжения в фазе 3'
                },
                {cmd: 0x2C, desc: 'Чтение времени выхода/возврата за мин.предельно допустимое значе-ние частоты сети'},
                {cmd: 0x2D, desc: 'Чтение времени выхода/возврата за мин.нормально допустимое значе-ние частоты сети'},
                {
                    cmd:  0x2E,
                    desc: 'Чтение времени выхода/возврата за макс. нормально допустимое значе-ние частоты сети'
                },
                {
                    cmd:  0x2F,
                    desc: 'Чтение времени выхода/возврата за макс. предельно допустимое значе-ние частоты сети'
                },
                {cmd: 0x30, desc: 'Чтение параметров провалов/перенапряжений по фазе 1'},
                {cmd: 0x31, desc: 'Чтение параметров провалов/перенапряжений по фазе 2'},
                {cmd: 0x32, desc: 'Чтение параметров провалов/перенапряжений по фазе 3'},
                {cmd: 0x80, desc: 'Время возникновения/пропадания обратного тока по фазе 1'},
                {cmd: 0x81, desc: 'Время возникновения/пропадания обратного тока по фазе 2'},
                {cmd: 0x82, desc: 'Время возникновения/пропадания обратного тока по фазе 3'},
                {cmd: 0x83, desc: 'Время начала/окончания отсутствия напряжения при наличии тока по фазе 1'},
                {cmd: 0x84, desc: 'Время начала/окончания отсутствия напряжения при наличии тока по фазе 2'},
                {cmd: 0x85, desc: 'Время начала/окончания отсутствия напряжения при наличии тока по фазе 3'},
                {cmd: 0x86, desc: 'Время начала/окончания нарушения чередования фаз'}
            ],
            readinfo: [
                {
                    code: 0x08,
                    cmd:  [0x00],
                    desc: 'Чтение серийногономера счетчика и даты выпуска',
                    func: f.readSnAndDate
                },
                {code: 0x08, cmd: [0x03], desc: 'Чтение версии ПО', func: f.firmwareVersion},
                {code: 0x08, cmd: [0x0B], desc: 'Чтение местоположения прибора', func: f.readLocation},
                {code: 0x08, cmd: [0x12], desc: 'Чтение варианта исполнения', func: f.variantExecution},
                {code: 0x08, cmd: [0x26], desc: 'Чтение CRC16 ПО прибора', func: f.crcDevice},
                {code: 0x08, cmd: [0x02], desc: 'Чтение коэффициента трансформации', func: f.transformRatio}
            ],
            write:    [
                /*cmd:				0x00, level: '2,3', 	desc: 'Инициализация основного массива средних мощностей (срезов)',
                cmd:				0x01, level: '1,2,3',	desc: 'Запись параметров индикации счетчика (по индицируемым тарифам)',
                cmd:				0x02, level: '1,2,3',	desc: 'Запись параметров индикации счетчика (по периодам индикации)',
                cmd:				0x03, level: '1,2,3',	desc: 'Запись параметров индикации счетчика',
                setTest:			0x04, level: '2,3',		desc: 'Вкл./выкл. режима «Тест»',
                setAddr:			0x05, level: '1,2,3',	desc: 'Запись нового сетевого адреса счетчика',
                cmd:				0x06, level: '2,3',		desc: 'Инициализация дополнительного массива средних мощностей (срезов)',
                Save:				0x08, level: '0',		desc: 'Фиксация данных',
                setTimeDate:		0x0C, level: '2,3',		desc: 'Установка времени',
                cmd:				0x0D, level: '1,2,3',	desc: 'Коррекция времени в пределах ±4 мин. один раз в сутки',
                cmd:				0x10, level: '2,3',		desc: 'Запрет записи параметров по PLC1',
                cmd:				0x11, level: '2,3',		desc: 'Запись параметров PLC1',
                cmd:				0x14, level: '1,2,3',	desc: 'Изменить параметры связи дополнительного интерфейса',
                cmd:				0x15, level: '1,2,3',	desc: 'Изменить параметры связи основного интерфейса',
                Reboot: 			0x16, level: '2,3',		desc: 'Перезапустить счетчик',
                cmd:				0x18, level: '2,3',		desc: 'Разрешить/запретить автоматический переход на зимнее/летнее время',
                cmd:				0x19, level: '2,3',		desc: 'Значения времени перехода для летнего и зимнего времени',
                cmd:				0x1A, level: '2,3',		desc: 'Запись серийного номера выносного дисплея',
                cmd:				0x1B, level: '2,3',		desc: 'Записать коэффициенты транс-формации Кн и Кт',
                cmd:				0x1D, level: '2,3',		desc: 'Записать тарифное расписание',
                cmd:				0x1E, level: '2,3',		desc: 'Записать расписание праздничных дней',
                setPwd: 			0x1F, level: '2,3',		desc: 'Изменить пароль',
                cmd:				0x21, level: '2,3',		desc: 'Инициализация регистров энергии',
                setLocation:		0x22, level: '2,3',		desc: 'Запись местоположения прибора',
                cmd:				0x23, level: '2,3',		desc: 'Запись расписания утреннего и вечернего максимумов',
                ClearMax:			0x24, level: '2,3',		desc: 'Сброс значений массива помесячных максимумов',
                cmd:				0x26, level: '2,3',		desc: 'Установка времени контроля за превышением лимита мощностии параметров автовключения реле',
                cmd:				0x27, level: '2,3',		desc: 'Изменение постоянной счетчика',
                cmd:				0x2A, level: '2,3',		desc: 'Изменение режима тарификатора',
                setLimitAPower:		0x2C, level: '2,3',		desc: 'Установка лимита активной мощности',
                cmd:				0x2D, level: '2,3',		desc: 'Включение контроля превышения лимита активной мощности',
                cmd:				0x2E, level: '2,3',		desc: 'Установка лимита потребленной активной энергии',
                setLimitAEnergy:	0x2F, level: '2,3',		desc: 'Включение контроля превышения потребленной активной энергии',
                setImpulse: 		0x30, level: '2,3',		desc: 'Изменение режима импульсного выхода',
                cmd:				0x31, level: '2,3',		desc: 'Изменение режима управления нагрузкой',
                setTimeout: 		0x32, level: '1,2,3',	desc: 'Изменение множителя таймаута основного интерфейса',
                cmd:				0x33, level: '2,3',		desc: 'Изменение режима учета технических потерь',
                cmd:				0x34, level: '2,3',		desc: 'Установка значений мощностей технических потерь',
                cmd:				0x35, level: '2,3',		desc: 'Изменение режима светодиодного индикатора и импульсного выхода R+ по виду энергии',
                cmd:				0x36, level: '2,3',		desc: 'Установка допустимых значений при контроле ПКЭ',
                cmd:				0x37, level: '2,3',		desc: 'Установка времени усреднения значений напряжения и частоты',*/
            ]
        }
    },
    respcode: {
        0: 'Everything is fine',
        1: 'Invalid command or parameter',
        2: 'Invalid command or parameter',
        3: 'Not enough level to satisfy request',
        4: 'The counter’s internal clock has already been adjusted during the current day.',
        5: 'Communication channel not open, try again later'
    },
    model:    {
        200:  {name: '200', type: 1, desc: {ru: 'Меркурий-200', en: 'Mercury-200'}},
        201:  {name: '201', type: 1, desc: {ru: 'Меркурий-201', en: 'Mercury-201'}},
        203:  {name: '203', type: 1, desc: {ru: 'Меркурий-203', en: 'Mercury-203'}},
        206:  {name: '206', type: 1, desc: {ru: 'Меркурий-206', en: 'Mercury-206'}},
        2032: {name: '2032', type: 2, desc: {ru: 'Меркурий-203.2TD', en: 'Mercury-203.2TD'}}, //двунаправленный
        204:  {name: '204', type: 2, desc: {ru: 'Меркурий-204', en: 'Mercury-204'}}, //двунаправленный
        208:  {name: '208', type: 2, desc: {ru: 'Меркурий-208', en: 'Mercury-208'}}, //Двунаправленный
        230:  {name: '230', type: 2, desc: {ru: 'Меркурий-230', en: 'Mercury-230'}},
        231:  {name: '231', type: 2, desc: {ru: 'Меркурий-231', en: 'Mercury-231'}},
        233:  {name: '233', type: 2, desc: {ru: 'Меркурий-233', en: 'Mercury-233'}},
        234:  {name: '234', type: 2, desc: {ru: 'Меркурий-234', en: 'Mercury-234'}},
        236:  {name: '236', type: 2, desc: {ru: 'Меркурий-236', en: 'Mercury-236'}},
        238:  {name: '238', type: 2, desc: {ru: 'Меркурий-238', en: 'Mercury-238'}}
    }
};

getArraysMonthCmd();
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

function getArraysMonthCmd(){
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

function getThree32BE(response, divider){
    if (!divider) divider = 1;
    return {
        one:   parseFloat(((Buffer.from([0, 0, response[3], response[2]]).readInt32BE(0)) / divider).toFixed(2)),
        two:   parseFloat(((Buffer.from([0, 0, response[6], response[5]]).readInt32BE(0)) / divider).toFixed(2)),
        three:  parseFloat(((Buffer.from([0, 0, response[9], response[8]]).readInt32BE(0)) / divider).toFixed(2))
    };
}

function getFour32BE(response, divider){
    if (!divider) divider = 1;
    return {
        one:    parseFloat(((Buffer.from([0, 0, response[3], response[2]]).readInt32BE(0)) / divider).toFixed(2)),
        two:   parseFloat( ((Buffer.from([0, 0, response[6], response[5]]).readInt32BE(0)) / divider).toFixed(2)),
        three:  parseFloat(((Buffer.from([0, 0, response[9], response[8]]).readInt32BE(0)) / divider).toFixed(2)),
        four:   parseFloat(((Buffer.from([0, 0, response[12], response[11]]).readInt32BE(0)) / divider).toFixed(2))
    };
}

function getFour32LE(response, divider){
    if (!divider) divider = 1;
    return {
        one:   parseFloat( ((Buffer.concat([response.slice(3, 5), response.slice(1, 3)]).readInt32LE(0)) / divider).toFixed(2)),
        two:   parseFloat( ((Buffer.concat([response.slice(7, 9), response.slice(5, 7)]).readInt32LE(0)) / divider).toFixed(2)),
        three:  parseFloat(((Buffer.concat([response.slice(11, 13), response.slice(9, 11)]).readInt32LE(0)) / divider).toFixed(2)),
        four:   parseFloat(((Buffer.concat([response.slice(15, 17), response.slice(13, 15)]).readInt32LE(0)) / divider).toFixed(2))
    };
}

const getVariant = function (byte, bit, val){
    return variant[byte][bit][val];
};

let getMonth = function (){
    const date = new Date();
    return ('0' + (date.getMonth() + 1)).slice(-2);
};

const getMonthCmd = function (){
    const date = new Date();
    return parseInt(48 + date.getMonth() + 1, 'hex');
};

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

module.exports.toHexString = function (byteArray){
    return Array.from(byteArray, function (byte){
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join(' ');
};
