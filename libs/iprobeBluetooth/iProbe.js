var jsFiles = [
    "libs/iprobeBluetooth/parser.js",
    "libs/iprobeBluetooth/rfidCoder.js",
    "libs/iprobeBluetooth/wusCoder.js"
];
var scriptTags = new Array(jsFiles.length);
for (var i = 0, len = jsFiles.length; i < len; i++) {
    scriptTags[i] = '<script type="text/javascript" src="' + jsFiles[i] + '"></script>';
}
document.write(scriptTags.join(""));

window.iProbe = {
    callBack: null,
    callBack2: null,
    callBackOnTreadDepth: null,
    callBackOnrfidNoTagFoundResponse: null,
    callBackOnPressure:null,
    callBackOnButtonClick:null,
    callBackOnButtonDoubleClick:null,
    
    reportType: {
        EIGHT_BIT_BINNARY: 0,
        EIGHT_TEXT_BINNARY: 1,
        TEN_BIT_BINNARY: 2,
        TEN_TEXT_BINNARY: 3
    },
    measurementUnits: {
        MM: 'M',
        INCHES: 'I',
        PSI: 'P',
        BAR: 'B'
    },
    initCallBackTreadDepth: function(onTreadDepth) {
        iProbe.callBackOnTreadDepth = onTreadDepth;
    },
    initCallBackOnPressure: function(onPressure){
        iProbe.callBackOnPressure = onPressure;
    },
    initCallBackOnButtonClick: function(onClick){
        iProbe.callBackOnButtonClick = onClick;
    },
    initCallBackOnButtonDoubleClick: function(onDoubleClick){
        iProbe.callBackOnButtonDoubleClick = onDoubleClick;
    },
    getDeviceList: function(success, failure) {
        bluetoothSerial.list(success, failure);
        bluetoothSerial.subscribe("\n", iProbe.onReceiveData, iProbe.onError);
    },
    onReceiveData: function(data) {
        //console.log("Mess: " + data[0]);
        parser.parseData(data);

    },
    onError: function() {
        console.log("ERROR");
    },
    connect: function(device, success, failure) {
        bluetoothSerial.connect(device, success, failure);
    },
    disconnect: function(success, failure) {
        bluetoothSerial.disconnect(success, failure);
    },
    sendCommand: function(command) {
        console.log('sending command: ' + command);
        bluetoothSerial.write(command + "\r", iProbe.onOk, iProbe.onCommandError);
    },
    onOk: function(data) {
        console.log('command send ' + data);
    },
    onCommandError: function(data) {
        console.log('command not send !!! ' + data);
    },
    /*
     * Commands
     */

    /*
     * return battery voltage in callback function
     */
    getBatteryInfo: function(callback) {
        iProbe.sendCommand('B');
        iProbe.callBack = callback;

    },
    /*
     * return device number as string
     */
    getDeviceNumber: function(callback) {
        iProbe.sendCommand('D');
        iProbe.callBack = callback;
    },
    getDeviceSWVersion: function(callback) {
        iProbe.sendCommand('V');
        iProbe.callBack = callback;
    },
    /*
     * return string from RFID EPC area
     */
    readRFID: function(callback) {
        iProbe.sendCommand('GR');
        iProbe.callBack = callback;
    },
    readRFIDMatricule: function(callback){
        iProbe.sendCommand('GR30020B');
        iProbe.callBack = callback;
    },
    /*
     * return string from RFID area
     */
    readRFIDContinuous: function(callback) {
        iProbe.sendCommand('GC');
        iProbe.callBack = callback;
    },
    /*
     * return 0-disabled/1-enabled - buzzer status for RFID
     */
    getBuzzer: function(callback) {
        iProbe.sendCommand('GB');
        iProbe.callBack = callback;
    },
    /*
     * set value = 0-disabled/1-enabled, callback function for return buzzer status from RFID
     */
    setBuzzer: function(value, callback) {
        iProbe.sendCommand('GB' + value);
        iProbe.callBack = callback;
    },
    /*
     * return 0-disabled/1-enabled - vibrator status for RFID
     */
    getVibrator: function(callback) {
        iProbe.sendCommand('GZ');
        iProbe.callBack = callback;
    },
    /*
     * set value = 0-disabled/1-enabled, callback function for return vibrator status from RFID
     */
    setVibrator: function(value, callback) {
        iProbe.sendCommand('GZ' + value);
        iProbe.callBack = callback;
    },
    /*
     * shutdown iProbe
     */
    shutDown: function() {
        iProbe.sendCommand('Ws');
    },
    /*
     * read TPMS software version return string
     */
    tpmsVersion: function(callback) {
        iProbe.sendCommand('JT>?\n');
        iProbe.callBack = callback;
    },
    /*
     * read frame from TPMS return [{id:wusID, pressure:_pressure, temperature:_temperature, rssi: _rssi},...]
     * rssi -RSSI level, signal Strength from TPMS
     */
    tpmsReadFrame: function(callback) {
        iProbe.sendCommand('JT>TR\n');
        iProbe.callBack = callback;
    },
    /*
     * read info from TPMS return as string;
     */
    tpmsReadInfo: function(id, callback) {
        iProbe.sendCommand('JT>TI:' + id + '\n');
        iProbe.callBack = callback;
    },
    /*
     * write info to TPMS
     * id - TPMS id
     * data - data for TPMS
     * callback - function(data){} return data from TPMS
     */
    tpmsWriteInfo: function(id, data, callback) {
        iProbe.sendCommand('JT>TI:' + id + '=' + data + '\n');
        iProbe.callBack = callback;
    },
    /*
     * return report type for RFID tag
     * return data in callback function = EIGHT_BIT_BINNARY/ EIGHT_TEXT_BINNARY/ TEN_BIT_BINNARY/ TEN_TEXT_BINNARY
     */
    getReportType: function(callback) {
        iProbe.sendCommand('R');
        iProbe.callBack = callback;
    },
    /*
     * type = iProbe.reportType.TEN_TEXT_BINNARY /...
     * return data in callback function = EIGHT_BIT_BINNARY/ EIGHT_TEXT_BINNARY/ TEN_BIT_BINNARY/ TEN_TEXT_BINNARY
     */
    setReportType: function(type, callback) {
        iProbe.sendCommand('R' + type);
        iProbe.callBack = callback;
    },
    /*
     * callback = function(data){} - return data for tread units M/I
     * callback2 = function(data){} - return data for pressure units P/B
     */
    getUnitsMeasurement: function(callback, callback2) {
        iProbe.sendCommand('U');
        iProbe.callBack = callback;
        iProbe.callBack2 = callback2;
    },
    /*
     * set units for tread
     * type: iProbe.measurementUnits.MM
     * type: iProbe.measurementUnits.INCHES
     * return M/I
     */
    setTreadUnits: function(type, callback) {
        iProbe.sendCommand('UT' + type);
        iProbe.callBack = callback;
    },
    /*
     * set units for pressure
     * type: iProbe.measurementUnits.PSI
     * type: iProbe.measurementUnits.BAR
     * return P/B
     */
    setPressureUnits: function(type, callback) {
        iProbe.sendCommand('UP' + type);
        iProbe.callBack = callback;
    },
    tpmsOff: function() {
        iProbe.sendCommand('');
    },
    rfidOff: function(callback){
        iProbe.sendCommand('GO');
        iProbe.callBack = callback;
    },
    getTreadDepth: function(){
        iProbe.sendCommand('T');
    },
    getPressure: function(){
        iProbe.sendCommand('P');
    },
    getCalibration: function(){
        iProbe.sendCommand('X');
    },
    setIdleTreadDepth: function(){
        iProbe.sendCommand('X1');
    },
    set0TreadDepth: function(){
        iProbe.sendCommand('X3');
    },
    set16TreadDepth: function(){
        iProbe.sendCommand('X4');
    },
    setIdlePressure: function(){
        iProbe.sendCommand('X2');
    },
    set0Pressure: function(){
        iProbe.sendCommand('X0');
    },
    set16Pressure: function(){
        iProbe.sendCommand('X6');
    },
};