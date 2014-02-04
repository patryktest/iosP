var dual_external_wheel_michelin_format = function() {
    var db = window.openDatabase('iprobeDB', '1.0', 'iprobe DB', 2 * 1024 * 1024);

    var vehicle_name = sessionStorage.getItem("fleet_inspection_selected_vehicle");
    var selected_wheel_ext = sessionStorage.getItem("dual_wheel_tpms_read_wheel_location_ext");
    var selected_wheel_int = sessionStorage.getItem("dual_wheel_tpms_read_wheel_location_int");

    var tpms_id_ext = sessionStorage.getItem("dual_wheel_tpms_read_input_sensor_ext");
    var tpms_temperature_ext = sessionStorage.getItem("dual_wheel_tpms_read_input_temperature_ext");
    var tpms_pressure_ext = sessionStorage.getItem("dual_wheel_tpms_read_input_pressure_ext");
    var tpms_id_int = sessionStorage.getItem("dual_wheel_tpms_read_input_sensor_int");
    var tpms_temperature_int = sessionStorage.getItem("dual_wheel_tpms_read_input_temperature_int");
    var tpms_pressure_int = sessionStorage.getItem("dual_wheel_tpms_read_input_pressure_int");

    /**
     * 
     */
    initialize();
    /*
     * 
     */

    function initialize() {
        setValues();
        initTreadDepthDual();
    }

    function setValues() {
        $("#dual_external_wheel_michelin_format_Input_Sensor_id").val("");
        $("#dual_external_wheel_michelin_format_Input_Cai").val("");
        $("#dual_external_wheel_michelin_format_Input_Serial_nr").val("");
        $("#dual_external_wheel_michelin_format_Input_Matricule").val("");
        $("#dual_external_wheel_michelin_format_Input_P").val("");
        $("#dual_external_wheel_michelin_format_Input_T").val("");
        $("#dual_external_wheel_michelin_format_Input_Ext").val("");
        $("#dual_external_wheel_michelin_format_Input_Mid").val("");
        $("#dual_external_wheel_michelin_format_Input_Int").val("");
        $("#dual_external_wheel_michelin_format_Message").text("");
        $("#dual_external_wheel_michelin_Message").text("");
        $("#dual_external_wheel_michelin_format_image").html('');
        


        ext = 0;
        mid = 0;
        int = 0;

        $("#dual_external_wheel_michelin_format_Input_Vehicle_id").val(vehicle_name);

        if (sessionStorage.getItem("ext") === "true" || sessionStorage.getItem("ext") === null) {
            $("#dual_external_wheel_michelin_format_Button_Int").hide();
            $("#dual_external_wheel_michelin_format_Button_Ext").show();
            $("#dual_external_wheel_michelin_format_Input_Wheel").val(selected_wheel_ext);
            sessionStorage.setItem("ext", "true");
        } else {
            $("#dual_external_wheel_michelin_format_Input_Wheel").val(selected_wheel_int);
            $("#dual_external_wheel_michelin_format_Button_Int").show();
            $("#dual_external_wheel_michelin_format_Button_Ext").hide();
        }
    }
    function initTreadDepthDual() {
        console.log('init callback function on tread depth - dual external michelin format');
        iProbe.initCallBackTreadDepth(getTreadDepthDualExternalMichelin);
    }

    /*
     * Examples:
     * setMessage("Vehicle list was added!", "info", "manage_vehicle_list_Message"); - show message in exist message element
     * setMessage("Vehicle list was added!", "info", null, "manage_vehicle_list_Button_Set_vehicle_list"); - create message after alement
     * @param {type} text
     * @param {type} type
     * @param {type} id_message_box
     * @param {type} after
     * @returns {undefined}
     */
    function setMessage(text, type, id_message_box, after) {
        if (id_message_box !== null) {
            $('#' + id_message_box).text(text);
            $('#' + id_message_box).removeClass("hide");
            $('#' + id_message_box).addClass(type);
            setTimeout("$('#" + id_message_box + "').fadeOut('slow');", 3000);
        } else if (after !== null) {
            var after = $('#' + after).after($("<div id='time_Message'></div>").text(text).addClass(type));
            setTimeout(function() {
                $('#time_Message').fadeOut('slow', function() {
                    $('#time_Message').remove();
                });
            }, 3000);
        }
    }

    function logData() {
        db.transaction(function(tx) {
            var cai = $("#dual_external_wheel_michelin_format_Input_Cai").val();
            var matricule = $("#dual_external_wheel_michelin_format_Input_Matricule").val();
//            var serial_nr = $("#dual_external_wheel_michelin_format_Input_Serial_nr").val();
            var pressure = $("#dual_external_wheel_michelin_format_Input_P").val();
            var temperature = $("#dual_external_wheel_michelin_format_Input_T").val();
            var tDext = $("#dual_external_wheel_michelin_format_Input_Ext").val();
            var tDmid = $("#dual_external_wheel_michelin_format_Input_Mid").val();
            var tDint = $("#dual_external_wheel_michelin_format_Input_Int").val();
            var comment = $("#dual_external_wheel_michelin_format_Input_Comment").val();
            var sensor_id = $("#dual_external_wheel_michelin_format_Input_Sensor_id").val();
            if (comment === "") {
                comment = "";
            }
            var selected_wheel;

            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear().toString().substring(2, currentDate.getFullYear().toString().length);
            var hour = currentDate.getHours();
            var minute = (currentDate.getMinutes().toString().length === 1) ? "0" + currentDate.getMinutes().toString() : currentDate.getMinutes().toString();
            var second = (currentDate.getSeconds().toString().length === 1) ? "0" + currentDate.getSeconds().toString() : currentDate.getSeconds().toString();
            var datetime = (day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second);


            if (sessionStorage.getItem("ext") === "true" || sessionStorage.getItem("ext") === null) {
                selected_wheel = selected_wheel_ext;
            } else {
                selected_wheel = selected_wheel_int;
            }

            tx.executeSql('INSERT INTO log (cai, matricule_serial_nr, date_time, vehicleNr, position, pressure, temperature, tDext, tDmid, tDint, sensor_id, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [cai, matricule, datetime, vehicle_name, selected_wheel, pressure, temperature, tDext, tDmid, tDint, sensor_id, comment], querySuccess, errorCB);
        });

        function querySuccess(tx, results) {
            synchTableFile.synchInspectionLog();
            //setMessage(data_localize.log_data_has_been_saved, "info", null, "dual_external_wheel_michelin_format_Button_Log_data");
            
            if (sessionStorage.getItem("ext") === "true") {
                sessionStorage.setItem("ext", "false");
                $("#dual_external_wheel_michelin_format_Button_Int").show();
                $("#dual_external_wheel_michelin_format_Button_Ext").hide();
                $("#page_dual_external_wheel_michelin_format :input").val("");
                $("#dual_external_wheel_michelin_format_Input_Wheel").val(selected_wheel_int);
                $("#dual_external_wheel_michelin_format_Input_Vehicle_id").val(vehicle_name);
                $("#dual_external_wheel_michelin_format_image").html('');
                info_box.show(data_localize.log_data_has_been_saved);
//                getTreadDepth();

            } else if (sessionStorage.getItem("ext") === "false") {
                sessionStorage.removeItem("ext");
                $("#page_dual_external_wheel_michelin_format :input").val("");
//                getTreadDepth();
                var timeout = setTimeout(function() {
                    $.mobile.changePage("#page_wheel_plan", {transition: "none", changeHash: true});
                }, 3200);
                info_box_ok.show(data_localize.log_data_has_been_saved,data_localize.ok,function(){
                    clearTimeout(timeout);
                    $.mobile.changePage("#page_wheel_plan", {transition: "none", changeHash: true});
                });

            }
            console.log("Log data was insert to DB ");
        }

        function errorCB(error) {
            console.error("Error insert log data to DB " + error.code);
        }
    }

    function getTreadDepthDualExternalMichelin(data) {

        console.log('call callback for treead depth in dualExteranalWheelFormatPage ext:' + ext + ' mid ' + mid + ' int: ' + int);
        if (ext === 0) {
            console.log('set ext:' + data);
            ext = data;
            $("#dual_external_wheel_michelin_format_Input_Ext").val(ext);
            $("#dual_external_wheel_michelin_format_Input_Mid").val("");
            $("#dual_external_wheel_michelin_format_Input_Int").val("");
            $("#dual_external_wheel_michelin_Message").text("");
        }
        else if (mid === 0) {
            console.log('set mid: ' + data);
            mid = data;
            $("#dual_external_wheel_michelin_format_Input_Mid").val(mid);
        }
        else {
            console.log('set int: ' + data);
            int = data
            $("#dual_external_wheel_michelin_format_Input_Int").val(int);
            $("#dual_external_wheel_michelin_Message").text(data_localize.depth_reading_complete);
            ext = 0;
            mid = 0;
            int = 0;
        }

    }

    $("#dual_external_wheel_michelin_format_Button_Read_tpms").unbind().click(function() {
        $("#dual_external_wheel_michelin_format_Input_Sensor_id").val("");
        $("#dual_external_wheel_michelin_format_Input_Cai").val("");
        $("#dual_external_wheel_michelin_format_Input_Matricule").val("");
        $("#dual_external_wheel_michelin_format_Input_P").val("");
        $("#dual_external_wheel_michelin_format_Input_T").val("");

        var sensor_id;
        var cai;
        var pressure;
        var temperature;
        var matricule_serial_nr;

        sensor_id = 0;
        cai = 0;
        pressure = 0;
        temperature = 0;
        matricule_serial_nr = 0;



        if (sessionStorage.getItem("ext") === "true") {
            sensor_id = tpms_id_ext;
            temperature = Number(tpms_temperature_ext);
            pressure = Number(tpms_pressure_ext);
        }
        else {
            sensor_id = tpms_id_int;
            temperature = Number(tpms_temperature_int);
            pressure = Number(tpms_pressure_int);
        }

        // From parameters settings
        if (localStorage.getItem("units_pressure") === "psi") {
            pressure = converter.barToPsi(pressure);
            pressure = converter.round(pressure, 2);
            pressure = pressure + " " + data_localize.psi;
        } else {
            pressure = converter.round(pressure, 2);
            pressure = pressure + " " + data_localize.bar;
        }

        // From parameters settings
        if (localStorage.getItem("units_temperature") === "fahrenheit") {
            temperature = converter.celsiusToFahrenheit(temperature);
            temperature = converter.round(temperature, 2);
            temperature = temperature + " " + data_localize.fahrenheit_f;
        } else {
            temperature = converter.round(temperature, 2);
            temperature = temperature + " " + data_localize.celsius_c;
        }

        $("#dual_external_wheel_michelin_format_Input_Sensor_id").val(sensor_id);
        $("#dual_external_wheel_michelin_format_Input_P").val(pressure);
        $("#dual_external_wheel_michelin_format_Input_T").val(temperature);

        if (sensor_id != "" || sensor_id != 0) {
            loader.show(data_localize.Reading);
            //  read tpms info
            console.log('start read info from tpms senID: ' + sensor_id);
            iProbe.tpmsReadInfo(sensor_id, function(data) {
                var information = null;
                var decodeData = null;

                if (data[0] != null) {
                    //sensor_id = data[0].id;
                    information = data[0].information;

                    decodeData = decodeWUS(information);
                    cai = decodeData.cai;
                    
                    if(decodeData.michelin){
                        $("label[for='dual_external_wheel_michelin_format_Input_Matricule']").text(data_localize.matricule);
                        matricule_serial_nr = decodeData.matricule;//information;
                    }
                    else{
                        $("label[for='dual_external_wheel_michelin_format_Input_Matricule']").text(data_localize.serial_nr);
                        matricule_serial_nr = decodeData.sn;
                        
                    }
                }
                ;

                $("#dual_external_wheel_michelin_format_Input_Cai").val(cai);
                $("#dual_external_wheel_michelin_format_Input_Matricule").val(matricule_serial_nr);
                loader.hide();
            })

        }
        else{
            info_box.show(data_localize.tpms_not_find);
        }




    });

    $("#dual_external_wheel_michelin_format_Button_Log_data").unbind().click(function() {
        var selected_wheel;
        var inspected_wheels = [];

        if (inspected_wheels = sessionStorage.getItem("ext") === "false") {
            selected_wheel = selected_wheel_ext;

            if ((inspected_wheels = sessionStorage.getItem("inspected_wheels")) !== null) {
                inspected_wheels = inspected_wheels.split(";");
                if (inspected_wheels.indexOf(selected_wheel) === -1)
                    sessionStorage.setItem("inspected_wheels", sessionStorage.getItem("inspected_wheels") + ";" + selected_wheel);
            } else {
                sessionStorage.setItem("inspected_wheels", selected_wheel);
            }
        } else {
            selected_wheel = selected_wheel_int;
        }

        logData();
    });
    
    $("#dual_external_wheel_michelin_format_Button_take_photo").unbind().click(function(){
        photo.take('dual_external_wheel_michelin_format_image',$("#dual_external_wheel_michelin_format_Input_Sensor_id").val());
    });
}