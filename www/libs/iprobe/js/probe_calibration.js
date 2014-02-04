var probe_calibration = function() {

    var calibration_step, idle_td, min_td, max_td, idle_pressure, min_pressure, max_pressure;
    var calibration_option = sessionStorage.getItem("calibrate_option");
    /**
     * 
     */
    initialize();
    /*
     * 
     */

    function initialize() {
        setValues();
        initTreadDepth();
        initPressureMeasurement();
        initIprobeButton();
    }

    function setValues() {
        if (calibration_option === null)
            calibration_option = tread_depth;

        switch (calibration_option) {
            case 'tread_depth':
                $('#probe_calibration_option_ps').hide();
                $('#probe_calibration_option_td').show();
                break;
            case 'pressure':
                $('#probe_calibration_option_ps').show();
                $('#probe_calibration_option_td').hide();
                break;
        }

        clearCalibration();
    }

    function initTreadDepth() {
        iProbe.initCallBackTreadDepth(setTreadDepth);
    }
    function initPressureMeasurement() {
        iProbe.initCallBackOnPressure(setPressureMeasurement);
    }
    function initIprobeButton() {
        iProbe.initCallBackOnButtonClick(onIprobeClick);
    }

    function setTreadDepth(data) {
        if (calibration_option !== 'tread_depth')
            return;

        switch (calibration_step) {
            case 0:
                return;
                break;
            case 1:
                idle_td = data;
                $('#probe_calibrate_Input_Idle_Tread_depth').val(idle_td);
                $('#probe_calibrate_Message').text(data_localize.calibration_td_2);
                iProbe.setIdleTreadDepth();
                break;
            case 2:
                min_td = data;
                console.log('min data: ' + min_td);
                $('#probe_calibrate_Input_Min_Tread_depth').val(min_td);
                $('#probe_calibrate_Message').text(data_localize.calibration_td_3);
                iProbe.set0TreadDepth();
                break;
            case 3:
                max_td = data;
                $('#probe_calibrate_Input_Max_Tread_depth').val(max_td);
                iProbe.set16TreadDepth();
                $('#probe_calibrate_Message').text(data_localize.calibration_td_4);
                $('#probe_calibrate_Button_Recalibrate').show();
                break;
        }
        calibration_step++;
    }
    ;
    function setPressureMeasurement(data) {
        if (calibration_option !== 'pressure')
            return;

        switch (calibration_step) {
            case 0:
                return;
                break;
            case 1:
                idle_pressure = data;
                $('#probe_calibrate_Input_Idle_Pressure').val(idle_pressure);
                $('#probe_calibrate_Message').text(data_localize.calibration_ps_2);
                iProbe.setIdlePressure();
                break;
            case 2:
                min_pressure = data;
                console.log('min data: ' + min_td);
                $('#probe_calibrate_Input_Min_Pressure').val(min_pressure);
                $('#probe_calibrate_Message').text(data_localize.calibration_ps_3);
                iProbe.set0Pressure();
                break;
            case 3:
                max_pressure = data;
                $('#probe_calibrate_Input_Max_Pressure').val(max_pressure);
                iProbe.set16Pressure();
                $('#probe_calibrate_Message').text(data_localize.calibration_ps_4);
                $('#probe_calibrate_Button_Recalibrate').show();
                break;
        }
        calibration_step++;
    }
    ;
    function clearCalibration() {
        calibration_step = 0;
        idle_td = min_td = max_td = idle_pressure = min_pressure = max_pressure = 0;
        $('#probe_calibrate_Input_Idle_Tread_depth').val(idle_td);
        $('#probe_calibrate_Input_Min_Tread_depth').val(min_td);
        $('#probe_calibrate_Input_Max_Tread_depth').val(max_td);
        $('#probe_calibrate_Input_Idle_Pressure').val(idle_pressure);
        $('#probe_calibrate_Input_Min_Pressure').val(min_pressure);
        $('#probe_calibrate_Input_Max_Pressure').val(max_pressure);
        $('#probe_calibrate_Button_Recalibrate').hide();

        if (calibration_option === 'tread_depth')
            $('#probe_calibrate_Message').text(data_localize.calibration_td_1);
        else
            $('#probe_calibrate_Message').text(data_localize.calibration_ps_1);
    }
    ;

    function onIprobeClick() {
        if (calibration_step === 0) {
            calibration_step = 1;
            if (calibration_option === 'tread_depth')
                iProbe.getTreadDepth();
            else
                iProbe.getPressure();
        }
    };

    $('#probe_calibrate_Button_Recalibrate').unbind('click').click(function() {
        clearCalibration();
    });
}