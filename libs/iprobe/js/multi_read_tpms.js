var multi_read_tpms = function() {

    /**
     * 
     */
    initialize();
    /*
     * 
     */

    function initialize() {
        setValues();
    }

    function setValues() {
           
        
        var stop_after = sessionStorage.getItem("read_tpms_stop_after");
        if (stop_after === null) {
            stop_after = 4;
        }
        $("#multi_read_tpms_Number_Stop_after").val(stop_after);

        for (var i = 0; i <= 6; i++) {
            $("#multi_read_tpms_Input_Sensor_found_" + i).parent().show();
            $("#multi_read_tpms_Input_Signal_strength_" + i).parent().show();
            $("#multi_read_tpms_Input_Select_sensor_" + i).parent().show();
        }

        for (var i = ++stop_after; i <= 6; i++) {
            $("#multi_read_tpms_Input_Sensor_found_" + i).parent().hide();
            $("#multi_read_tpms_Input_Signal_strength_" + i).parent().hide();
            $("#multi_read_tpms_Input_Select_sensor_" + i).parent().hide();
        }

        var sensor_id_1, sensor_id_2, sensor_id_3, sensor_id_4, sensor_id_5, sensor_id_6;
        var signal_strength_1, signal_strength_2, signal_strength_3, signal_strength_4, signal_strength_5, signal_strength_6;

        clearValues();

        window.setTimeout(function() {
            startReadTPMS();
        }, 1);
        

//        $("#multi_read_tpms_Div_Timeout").removeClass("circle_silver");
//        $("#multi_read_tpms_Div_Timeout").addClass("circle_green");
    }

    function clearValues(){
        sensor_id_1 = 0;
        sensor_id_2 = 0;
        sensor_id_3 = 0;
        sensor_id_4 = 0;
        sensor_id_5 = 0;
        sensor_id_6 = 0;


        signal_strength_1 = 0;
        signal_strength_2 = 0;
        signal_strength_3 = 0;
        signal_strength_4 = 0;
        signal_strength_5 = 0;
        signal_strength_6 = 0;

        $("#multi_read_tpms_Input_Sensor_found_1").val(sensor_id_1);
        $("#multi_read_tpms_Input_Sensor_found_2").val(sensor_id_2);
        $("#multi_read_tpms_Input_Sensor_found_3").val(sensor_id_3);
        $("#multi_read_tpms_Input_Sensor_found_4").val(sensor_id_4);
        $("#multi_read_tpms_Input_Sensor_found_5").val(sensor_id_5);
        $("#multi_read_tpms_Input_Sensor_found_6").val(sensor_id_6);

        $("#multi_read_tpms_Input_Signal_strength_1").val(signal_strength_1);
        $("#multi_read_tpms_Input_Signal_strength_2").val(signal_strength_2);
        $("#multi_read_tpms_Input_Signal_strength_3").val(signal_strength_3);
        $("#multi_read_tpms_Input_Signal_strength_4").val(signal_strength_4);
        $("#multi_read_tpms_Input_Signal_strength_5").val(signal_strength_5);
        $("#multi_read_tpms_Input_Signal_strength_6").val(signal_strength_6);
    }
    function startReadTPMS(){
        loader.show(data_localize.Reading);
        iProbe.tpmsReadFrame(function(data) {
            if (data.length === 0)
                info_box.show(data_localize.tpms_not_find);
            else {
                data.sort(function(a, b) {
                    return b.rssi - a.rssi;
                })
                for (var i = 0; i < data.length; i++) {
                    $("#multi_read_tpms_Input_Sensor_found_" + (i + 1)).val(data[i].id);
                    $("#multi_read_tpms_Input_Signal_strength_" + (i + 1)).val(data[i].rssi);
                }
                ;
                iProbe.tpmsOff();
                loader.hide();
            }
        });
    };
    $("#multi_read_tpms_Input_Select_sensor_1").click(function() {
        var sensor = $("#multi_read_tpms_Input_Sensor_found_1").val();
        sessionStorage.setItem("multi_read_tpms_sensor", sensor);
    });

    $("#multi_read_tpms_Input_Select_sensor_2").click(function() {
        var sensor = $("#multi_read_tpms_Input_Sensor_found_2").val();
        sessionStorage.setItem("multi_read_tpms_sensor", sensor);
    });

    $("#multi_read_tpms_Input_Select_sensor_3").click(function() {
        var sensor = $("#multi_read_tpms_Input_Sensor_found_3").val();
        sessionStorage.setItem("multi_read_tpms_sensor", sensor);
    });

    $("#multi_read_tpms_Input_Select_sensor_4").click(function() {
        var sensor = $("#multi_read_tpms_Input_Sensor_found_4").val();
        sessionStorage.setItem("multi_read_tpms_sensor", sensor);
    });
    
    $("#multi_read_tpms_read_Button_Retry").unbind('click').click(function(){
        clearValues();
        startReadTPMS();
    });
    $("#multi_read_tpms_Number_Stop_after").change(function() {
        var stop_after = $(this).val();
        sessionStorage.setItem("read_tpms_stop_after", stop_after);
        setValues();
    });
}