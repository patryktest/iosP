window.parser = {
    status: '',
    wusResponseType: 'info',
    buffer: [],
    parseData: function(data) {
        switch (data[0]) {
            case 'B':
                parser.batteryResponse(data);
                break;
            case 'D':
                parser.deviceNumberResponse(data);
                break;
            case 'G':
                parser.rfidResponse(data);
                break;
            case 'T':
                parser.treadDepthResponse(data);
                break;
            case 'P':
                parser.pressureResponse(data);
                break;
            case 'R':
                parser.reportTypeResponse(data);
                break;
            case 'U':
                parser.unitsMeasurementResponse(data);
                break;
            case 'V':
                parser.swVersionResponse(data);
                break;
            case 'N':
                parser.buttonResponse(data);
                break;
            case '<':
                parser.tpmsResponse(data);
                break;
            default:
                parser.commandNotFound(data);
                break;
        }
        console.log('DATA:' + data);

    },
    batteryResponse: function(data) {
        var voltageNumber = Number(data.substr(1, data.length));
        var voltage = ((7.4 / 1024) * voltageNumber).toFixed(2);
        iProbe.callBack(voltage);
        //console.log("Batrery V: "+voltage);
    },
    deviceNumberResponse: function(data) {
        var deviceNumber = data.substr(1, data.length);
        iProbe.callBack(deviceNumber);
        //console.log('Device number: '+deviceNumber);
    },
    rfidResponse: function(data) {
        switch (data[1]) {
            case 'R':
                parser.rfidReadResponse(data);
                break;
            case 'W':
                parser.rfidWriteResponse(data);
                break;
            case 'C':
                parser.rfidContinuousReadResponse(data);
                break;
            case 'O':
                parser.rfidCanselResponse();
                break;
            case 'B':
                parser.rfidBuzzerResponse(data);
                break;
            case 'Z':
                parser.rfidVibratorResponse(data);
                break;
            case 'S':
                if (data[2] == 'T')
                    parser.rfidNoTagFoundResponse();
                break;
            default:
                parser.commandNotFound(data);
                break;
        }
    },
    rfidReadResponse: function(data) {
        var responseData;
        var respondeDataObject = {};
        switch (data.length) {
            case 27:
                responseData = data.substr(2, 24);
                respondeDataObject = decodeDataRFID(responseData); // return {EPCheader,filter,partition,companyPrefix,cai,sn,encodedData,michelin}
                break;
            case 23:
                responseData = data.substr(2, 20);
                respondeDataObject = decodeRFIDDataFromUserArea(responseData); // return matricule
                break;
        }
        iProbe.callBack(respondeDataObject);
        //console.log('Read RIF tag data: ' + responseData);
    },
    rfidWriteResponse: function(data) {
        var responseData = data.substr(2, data.length);
        console.log('Write RIF tag data: ' + responseData);
    },
    rfidContinuousReadResponse: function(data) {
        //parser.status = 'continuous_read';
        var responseData = data.substr(2, 24);
        var respondeDataObject = decodeDataRFID(responseData);
        iProbe.callBack(respondeDataObject);

    },
    rfidCanselResponse: function() {
        console.log('Cancel continuous reading from RFID tag');
        iProbe.callBack();
    },
    rfidBuzzerResponse: function(data) {
        var responseData = Number(data.substr(2, data.length));
        iProbe.callBack(responseData);
        console.log('Buzzer status: ' + responseData);
    },
    rfidVibratorResponse: function(data) {
        var responseData = Number(data.substr(2, data.length));
        iProbe.callBack(responseData);
        console.log('Vibrator status: ' + responseData);
    },
    rfidNoTagFoundResponse: function() {
        console.log('No tag found');
        iProbe.callBackOnrfidNoTagFoundResponse();
    },
    treadDepthResponse: function(data) {
        var responseData = data.substr(1, data.length);
        iProbe.callBackOnTreadDepth(responseData);
    },
    pressureResponse: function(data) {
        var responseData = data.substr(1, data.length);
        iProbe.callBackOnPressure(responseData);
        console.log('Pressure: ' + responseData);
    },
    reportTypeResponse: function(data) {
        var responseData = Number(data.substr(1, data.length));
        var responseText = 'TEN_TEXT_BINNARY';
        switch (responseData) {
            case 0:
                responseText = 'EIGHT_BIT_BINNARY';
                break;
            case 1:
                responseText = 'EIGHT_TEXT_BINNARY';
                break;
            case 2:
                responseText = 'TEN_BIT_BINNARY';
                break;
            case 3:
                responseText = 'TEN_TEXT_BINNARY';
                break;
        }
        iProbe.callBack(responseText);
    },
    unitsMeasurementResponse: function(data) {
        var responseData = data.substr(1, 2);
        switch (responseData) {
            case 'T':
                parser.unitsTreadResponse(data);
                break;
            case 'P':
                parser.unitsPressureResponse(data);
                break;
        }
    },
    unitsTreadResponse: function(data) {
        var responseData = data.substr(2, 3);
        console.log('tred units ' + data);
        iProbe.callBack(responseData);
    },
    unitsPressureResponse: function(data) {
        var responseData = data.substr(2, 3);
        console.log('pressure units ' + data);
        iProbe.callBack2(responseData);
    },
    swVersionResponse: function(data) {
        var responseData = data.substr(1, data.length);
        iProbe.callBack(responseData);
    },
    tpmsResponse: function(data) {
        var responseData = data.substr(1, 2);
        switch (responseData) {
            case '?=':
                parser.tpmsVersionResponse(data);
                break;
            case 'TR':
                parser.tpmsStartRFFrameResponse();
                break;
            case 'W:':
                parser.tpmsWUSReceptionResponse(data);
                break;
            case 'T0':
                parser.tpmsStopResponse();
                break;
            case 'R1':
                parser.tpmsEnableRFReceiverResponse();
                break;
            case 'R0':
                parser.tpmsDisableRFReceiverResponse();
                break;
            case 'TI':
                parser.tpmsWUSInformationResponse(data);
                break;
            default:
                parser.commandNotFound(data);
                break;
        }
    },
    tpmsVersionResponse: function(data) {
        var version = data.substr(data.length - 3, data.length - 1);
        iProbe.callBack(version);
        iProbe.sendCommand('\n');
    },
    tpmsStartRFFrameResponse: function() {
        parser.wusResponseType = 'frame';
        console.log('start WUS RF frame');
    },
    tpmsWUSInformationResponse: function(data) {
        parser.wusResponseType = 'info';
        /*if(data.length>14)
         parser.wusResponseType = 'infoWrite';
         */
        console.log('start WUS read/wtite: ' + parser.wusResponseType);
    },
    tpmsWUSReceptionResponse: function(data) {
        var responseData = data.substr(3, data.length-4);
        if (parser.wusResponseType === 'frame') {
            var partsArray = responseData.split('-');
            var wusID = partsArray[0];
            var _pressure = (parseInt(partsArray[1], 16) * 14 / 255).toFixed(2);
            var _temperature = parseInt(partsArray[2], 16) - 50;
            var _rssi = parseInt(partsArray[6], 16);
            var update = false;
            for (var i = 0; i < parser.buffer.length; i++) {
                if (parser.buffer[i].id == wusID) {
                    parser.buffer[i] = {id: wusID, pressure: _pressure, temperature: _temperature, rssi: _rssi};
                    update = true;
                }
            }
            if (!update)
                parser.buffer.push({id: wusID, pressure: _pressure, temperature: _temperature, rssi: _rssi});

            console.log('WUS-' + wusID + ' pressure: ' + _pressure + ' temperature: ' + _temperature + ' rssi: ' + _rssi);
        }
        else {
            var partsArray = responseData.split('-');
            var wusID = partsArray[0];
            var information = partsArray[1];
            var update = false;

            for (var i = 0; i < parser.buffer.length; i++) {
                if (parser.buffer[i].id == wusID) {
                    parser.buffer[i] = {id: wusID, information: information};
                    update = true;
                }
            }
            if (!update)
                parser.buffer.push({id: wusID, information: information});

            console.log('WUS-' + wusID + ' information: ' + information);
            console.log('send data to app response type: ' + parser.wusResponseType + " buffer: " + parser.buffer);
            iProbe.callBack(parser.buffer);
            parser.buffer = [];
            console.log('send stop WUS command');
            iProbe.sendCommand('\n');
        }
    },
    tpmsStopResponse: function() {
        //if(parser.wusResponseType==='frame')
        console.log('send data to app response type: ' + parser.wusResponseType);

        parser.wusResponseType = 'info';

        console.log('stop WUS command');

        iProbe.callBack(parser.buffer);
        parser.buffer = [];

    },
    tpmsEnableRFReceiverResponse: function() {
        console.log('enable RF receive');
    },
    tpmsDisableRFReceiverResponse: function() {
        console.log('stop RF receive');
    },
    buttonResponse: function(data) {
        var responseData = data.substr(1, 1);
        switch (responseData) {
            case '1':
                parser.buttonClickResponse();
                break;
            case '2':
                parser.buttonDoubleClickResponse();
                break;
        }
    },
    buttonClickResponse: function() {
        iProbe.callBackOnButtonClick();
    },
    buttonDoubleClickResponse: function() {
        iProbe.callBackOnButtonDoubleClick();
    },
    commandNotFound: function(data) {
        console.log("ERR command not found: " + data);
    }



};
/*
 read
 ERR command not found: <TI:0C04D339
 DATA:<TI:0C04D339
 WUS-0C04D339-0000000000800001 information: undefined
 DATA:<W:0C04D339-0000000000800001 
 
 write
 ERR command not found: <TI:0C04D339=00000000008FFFF1
 DATA:<TI:0C04D339=00000000008FFFF1
 WUS-0C04D339-00000000008FFFF1 information: undefined
 DATA:<W:0C04D339-00000000008FFFF1 
 
 
 start WUS read/wtite: info
 DATA:<TI:0C04D339=00000000008FFFF4
 WUS-0C04D339 information: 00000000008FFFF4
 DATA:<W:0C04D339-00000000008FFFF4
 command send OK
 DATA:GR3005FB63AC1F3681EC880468
 command send OK
 start WUS RF frame
 DATA:<TR
 WUS-0C04D339 pressure: 0.05 temperature: 19 rssi: 67
 DATA:<W:0C04D339-01-45-01-9-7-43
 WUS-0C04D339 pressure: 0.05 temperature: 19 rssi: 68
 DATA:<W:0C04D339-01-45-01-9-7-44
 WUS-0C04D339 pressure: 0.05 temperature: 19 rssi: 67
 DATA:<W:0C04D339-01-45-01-9-7-43
 WUS-0C04D339 pressure: 0.05 temperature: 19 rssi: 68
 DATA:<W:0C04D339-01-45-01-9-7-44
 WUS-0C04D339 pressure: 0.05 temperature: 20 rssi: 67
 DATA:<W:0C04D339-01-46-01-9-7-43
 WUS-0C04D339 pressure: 0.05 temperature: 20 rssi: 67
 DATA:<W:0C04D339-01-46-01-9-7-43
 WUS-0C04D339 pressure: 0.05 temperature: 20 rssi: 68
 DATA:<W:0C04D339-01-46-01-9-7-44
 WUS-0C04D339 pressure: 0.05 temperature: 20 rssi: 68
 DATA:<W:0C04D339-01-46-01-9-7-44
 send data to app response type: frame
 stop WUS command
 DATA:<T0
 command send OK
 bin num0100000000000000000000001300000000000000000000000002757042373736
 hexanum0000000000800001
 command send OK
 start WUS read/wtite: info
 DATA:<TI:0C04D339=0000000000800001
 WUS-0C04D339 information: 0000000000800001
 DATA:<W:0C04D339-0000000000800001 
 
 */