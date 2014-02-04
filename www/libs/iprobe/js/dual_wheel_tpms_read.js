var dual_wheel_tpms_read = function() {
    /**
     * 
     */
    initialize();
    /*
     * 
     */

    function initialize() {
        clearFields();
        setValues();
    }

    function setValues() {
        var selected_wheel = sessionStorage.getItem("wheel_plan_Selected_wheel");
        var wheel_location_1;
        var wheel_location_2;

        if (selected_wheel === "2ED" || selected_wheel === "2ID") {
            wheel_location_1 = "2ED";
            wheel_location_2 = "2ID";
        } else if (selected_wheel === "2IG" || selected_wheel === "2EG") {
            wheel_location_1 = "2IG";
            wheel_location_2 = "2EG";
        } else if (selected_wheel === "3IG" || selected_wheel === "3EG") {
            wheel_location_1 = "3IG";
            wheel_location_2 = "3EG";
        } else if (selected_wheel === "3ID" || selected_wheel === "3ED") {
            wheel_location_1 = "3ID";
            wheel_location_2 = "3ED";
        }
        else if(selected_wheel === "4IG" || selected_wheel === "4EG"){
            wheel_location_1 = "4IG";
            wheel_location_2 = "4EG";
        }
        else if(selected_wheel === "4ID" || selected_wheel === "4ED"){
            wheel_location_1 = "4ID";
            wheel_location_2 = "4ED";
        }

        var sensor_found_1, sensor_found_2;
        var signal_strength_1, signal_strength_2;

        sensor_found_1 = 0;
        sensor_found_2 = 0;
        signal_strength_1 = 0;
        signal_strength_2 = 0;
        pressure = [0, 0];
        temperature = [0, 0];

        //read tpms 
        console.log('read dual tpms get sensor id and signal strength');
        window.setTimeout(function(){
            loader.show(data_localize.Scanning);
        }, 1); 
        
        iProbe.tpmsReadFrame(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (i < 2) {
                    console.log('senzor id:' + data[i].id + " rssi:" + data[i].rssi);
                    $("#dual_wheel_tpms_read_Input_Sensor_found_" + (i + 1)).val(data[i].id);
                    $("#dual_wheel_tpms_read_Input_Signal_strength_" + (i + 1)).val(data[i].rssi);
                    pressure[i] = data[i].pressure;
                    temperature[i] = data[i].temperature;
                }

            };
            iProbe.tpmsOff();
            loader.hide();
            
            if(data.length===0){
                info_box.show(data_localize.tpms_not_find);
            };
        });

        //$("#dual_wheel_tpms_read_Input_Sensor_found_1").val(sensor_found_1);
        //$("#dual_wheel_tpms_read_Input_Signal_strength_1").val(signal_strength_1);
        $("#dual_wheel_tpms_read_Input_Wheel_location_1").val(wheel_location_1);

        //$("#dual_wheel_tpms_read_Input_Sensor_found_2").val(sensor_found_2);
        //$("#dual_wheel_tpms_read_Input_Signal_strength_2").val(signal_strength_1);
        $("#dual_wheel_tpms_read_Input_Wheel_location_2").val(wheel_location_2);
    }

    function clearFields() {
        $("#dual_wheel_tpms_read_Input_Sensor_found_1").val('');
        $("#dual_wheel_tpms_read_Input_Signal_strength_1").val('');

        $("#dual_wheel_tpms_read_Input_Sensor_found_2").val('');
        $("#dual_wheel_tpms_read_Input_Signal_strength_2").val('');
    }

    $("#dual_wheel_tpms_read_Button_Swap").unbind().click(function() {
        var wheel_location_1 = $("#dual_wheel_tpms_read_Input_Wheel_location_1").val();
        var wheel_location_2 = $("#dual_wheel_tpms_read_Input_Wheel_location_2").val();

        $("#dual_wheel_tpms_read_Input_Wheel_location_1").val(wheel_location_2);
        $("#dual_wheel_tpms_read_Input_Wheel_location_2").val(wheel_location_1);
    });

    $("#dual_wheel_tpms_read_Button_Retry").unbind('click').click(function() {
        console.log("retry dual read send");
        clearFields();
        //read tpms 
        loader.show(data_localize.Scanning);
        iProbe.tpmsReadFrame(function(data) {
            
            for (var i = 0; i < data.length; i++) {
                if (i < 2) {
                    console.log('senzor id:' + data[i].id + " rssi:" + data[i].rssi);
                    $("#dual_wheel_tpms_read_Input_Sensor_found_" + (i + 1)).val(data[i].id);
                    $("#dual_wheel_tpms_read_Input_Signal_strength_" + (i + 1)).val(data[i].rssi);
                    pressure[i] = data[i].pressure;
                    temperature[i] = data[i].temperature;
                }

            };
            iProbe.tpmsOff();
            loader.hide();
            
            if(data.length===0){
                info_box.show(data_localize.tpms_not_find);
            };
        });
    });

    $("#dual_wheel_tpms_read_Button_Ok").unbind().click(function() {
        if ($("#dual_wheel_tpms_read_Input_Sensor_found_1").val() != '') {
            sessionStorage.setItem("dual_wheel_tpms_read_wheel_location_ext", $("#dual_wheel_tpms_read_Input_Wheel_location_1").val());
            sessionStorage.setItem("dual_wheel_tpms_read_wheel_location_int", $("#dual_wheel_tpms_read_Input_Wheel_location_2").val());
            sessionStorage.setItem("dual_wheel_tpms_read_input_sensor_ext", $("#dual_wheel_tpms_read_Input_Sensor_found_1").val());
            sessionStorage.setItem("dual_wheel_tpms_read_input_sensor_int", $("#dual_wheel_tpms_read_Input_Sensor_found_2").val());
            sessionStorage.setItem("dual_wheel_tpms_read_input_temperature_ext", temperature[0]);
            sessionStorage.setItem("dual_wheel_tpms_read_input_pressure_ext", pressure[0]);
            sessionStorage.setItem("dual_wheel_tpms_read_input_temperature_int", temperature[1]);
            sessionStorage.setItem("dual_wheel_tpms_read_input_pressure_int", pressure[1]);


            $.mobile.changePage("#page_dual_external_wheel_michelin_format", {transition: "none", reloadPage: false, changeHash: true});
        }
    });
}