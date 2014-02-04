var probe_settings = function() {

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
    }

    function setValues() {
        $("#probe_settings_Div_Tpms_indicate").removeClass("circle_silver");
        $("#probe_settings_Div_Tpms_indicate").addClass("circle_green");
		console.log('call get Buzzer data')
        iProbe.getBuzzer(function(data){
			console.log('onBuzzer status get status = '+data);
            if(data==1)    {console.log('set buzzer to on');$("#probe_settings_Slider_Beep").val('on').slider("refresh");}
            else        {console.log('set buzzer to off');$("#probe_settings_Slider_Beep").val('off').slider("refresh");}
            
			console.log('call get vibrator data');
            iProbe.getVibrator(function(data){
				console.log('onVibrator status get status = '+data)
                if(data==1) {console.log('set vibrator to on');$("#probe_settings_Slider_Vibrate").val('on').slider("refresh");}
                else        {console.log('set vibrator to off');$("#probe_settings_Slider_Vibrate").val('off').slider("refresh");}
            })      
        })
        
    }
    
    function initTreadDepth(){
        iProbe.initCallBackTreadDepth(setTreadDepth);
    }
    function initPressureMeasurement(){
        iProbe.initCallBackOnPressure(setPressureMeasurement)
    }
    
    $("#probe_settings_Slider_Beep").change(function() {
        var beep = 0;
        if($(this).val()=='on')
            beep = 1;
        else
            beep = 0;
        
        iProbe.setBuzzer(beep,function(data){});
    });

    $("#probe_settings_Slider_Vibrate").change(function() {
        var vibrate = 0;
        if($(this).val()=='on')
            vibrate = 1;
        else
            vibrate = 0;
        
        iProbe.setVibrator(vibrate,function(data){});
    });

    $("#probe_settings_Select_Idle_timeout").change(function() {
        var idel_timeout = $(this).val();
        console.log("not implemented");
    });

    $("#probe_settings_Button_Calibrate_tread_depth").click(function() {
        sessionStorage.setItem("calibrate_option", "tread_depth");
    });

    $("#probe_settings_Button_Calibrate_pressure").unbind('click').click(function() {
        sessionStorage.setItem("calibrate_option", "pressure");
    });
    
    function setTreadDepth(data){
        $("#probe_settings_Input_Tread_depth").val(data);
    };
    function setPressureMeasurement(data){
        $("#probe_settings_Input_Calibrate_pressure").val(data);
    };
}