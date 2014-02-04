var single_wheel_standard_format = function() {
    var db = window.openDatabase('iprobeDB', '1.0', 'iprobe DB', 2 * 1024 * 1024);

    var vehicle_name = sessionStorage.getItem("fleet_inspection_selected_vehicle");
    var selected_wheel = sessionStorage.getItem("wheel_plan_Selected_wheel");
    var ext;
    var mid;
    var int;

    /**
     * 
     */
    initialize();
    /*
     * 
     */

    function initialize() {
        setValues();
        initStandartTreadDepth();
    }

    function setValues() {
        clearValues();

        $("#single_wheel_standard_format_Input_Ext").val("");
        $("#single_wheel_standard_format_Input_Mid").val("");
        $("#single_wheel_standard_format_Input_Int").val("");
        $("#single_wheel_standard_format_Input_Vehicle_id").val(vehicle_name);
        $("#single_wheel_standard_format_Input_Wheel").val(selected_wheel);
        $("#single_wheel_standard_format_Message").text("");
        $("#single_wheel_standard_format_image").html('');

        ext = 0;
        mid = 0;
        int = 0;

        $("#single_wheel_standard_format_Input_Ext").val(ext);
        $("#single_wheel_standard_format_Input_Mid").val(mid);
        $("#single_wheel_standard_format_Input_Int").val(int);
    }
    function clearValues() {
        $("#single_wheel_standard_format_Input_Sensor_id").val("");
        $("#single_wheel_standard_format_Input_Cai").val("");
        $("#single_wheel_standard_format_Input_Serial_nr").val("");
        $("#single_wheel_standard_format_Input_P").val("");
        $("#single_wheel_standard_format_Input_T").val("");
    }
    function initStandartTreadDepth() {
        console.log('init callback function');
        iProbe.initCallBackTreadDepth(setStandartTreadDepth);
    }
    function setStandartTreadDepth(data) {
        console.log('call callback for treead depth ext:' + ext + ' mid ' + mid + ' int: ' + int);
        if (ext === 0) {
            console.log('set ext:' + data);
            ext = data;
            $("#single_wheel_standard_format_Input_Ext").val(ext);
            $("#single_wheel_standard_format_Input_Mid").val("");
            $("#single_wheel_standard_format_Input_Int").val("");
            $("#single_wheel_standard_format_Message").text("");
        }
        else if (mid === 0) {
            console.log('set mid: ' + data);
            mid = data;
            $("#single_wheel_standard_format_Input_Mid").val(mid);
        }
        else {
            console.log('set int: ' + data);
            int = data
            $("#single_wheel_standard_format_Input_Int").val(int);
            $("#single_wheel_standard_format_Message").text(data_localize.depth_reading_complete);
            ext = 0;
            mid = 0;
            int = 0;
        }


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
            var cai = $("#single_wheel_standard_format_Input_Cai").val();
//            var matricule = $("#single_wheel_standard_format_Input_Matricule").val();
            var serial_nr = $("#single_wheel_standard_format_Input_Serial_nr").val();
            var pressure = $("#single_wheel_standard_format_Input_P").val();
            var temperature = $("#single_wheel_standard_format_Input_T").val();
            var tDext = $("#single_wheel_standard_format_Input_Ext").val();
            var tDmid = $("#single_wheel_standard_format_Input_Mid").val();
            var tDint = $("#single_wheel_standard_format_Input_Int").val();
            var comment = $("#single_wheel_standard_format_Input_Comment").val();
            var sensor_id = $("#single_wheel_standard_format_Input_Sensor_id").val();
            if (comment === "") {
                comment = "";
            }

            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear().toString().substring(2, currentDate.getFullYear().toString().length);
            var hour = currentDate.getHours();
            var minute = (currentDate.getMinutes().toString().length === 1) ? "0" + currentDate.getMinutes().toString() : currentDate.getMinutes().toString();
            var second = (currentDate.getSeconds().toString().length === 1) ? "0" + currentDate.getSeconds().toString() : currentDate.getSeconds().toString();
            var datetime = (day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second);

            tx.executeSql('INSERT INTO log (cai, matricule_serial_nr, date_time, vehicleNr, position, pressure, temperature, tDext, tDmid, tDint, sensor_id, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [cai, serial_nr, datetime, vehicle_name, selected_wheel, pressure, temperature, tDext, tDmid, tDint, sensor_id, comment], querySuccess, errorCB);
        });

        function querySuccess(tx, results) {
            synchTableFile.synchInspectionLog();
            //setMessage(data_localize.log_data_has_been_saved, "info", null, "single_wheel_standard_format_Button_Log_data");
            console.log("Log data was insert to DB ");
            var timeout = setTimeout(function() {
                $.mobile.changePage("#page_wheel_plan", {transition: "none", changeHash: true});
            }, 3200);
            info_box_ok.show(data_localize.log_data_has_been_saved,data_localize.ok,function(){
                clearTimeout(timeout);
                $.mobile.changePage("#page_wheel_plan", {transition: "none", changeHash: true})
            });
        }

        function errorCB(error) {
            console.error("Error insert log data to DB " + error.code);
        }
    }

    $("#single_wheel_standard_format_Button_Read_tpms").unbind().click(function() {
        clearValues();
        var sensor_id;
        var cai;
        var pressure;
        var temperature;
        var matricule_serial_nr;

        sensor_id = 0;
        cai = 0;
        matricule_serial_nr = 0;
        pressure = 100; // bar
        temperature = 100; // °C


        loader.show(data_localize.Reading);
        iProbe.tpmsReadFrame(function(data) {

            if (data[0] != null) {
                console.log('data on first position id:' + data[0].id + ' pressure: ' + data[0].pressure + 'temperature: ' + data[0].temperature);
                sensor_id = data[0].id;
                pressure = Number(data[0].pressure);
                temperature = Number(data[0].temperature);
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

            $("#single_wheel_standard_format_Input_Sensor_id").val(sensor_id);
            $("#single_wheel_standard_format_Input_P").val(pressure);
            $("#single_wheel_standard_format_Input_T").val(temperature);

            if (sensor_id != 0) {
                /*
                 *	read tpms info
                 */
                console.log('start read info from tpms senID: ' + sensor_id);
                iProbe.tpmsReadInfo(sensor_id, function(data) {
                    var information = null;
                    var decodeData = null;

                    if (data[0] != null) {
                        //sensor_id = data[0].id;
                        information = data[0].information;

                        decodeData = decodeWUS(information);
                        cai = decodeData.cai;
                        if (decodeData.michelin) {
                            $("label[for='single_wheel_standard_format_Input_Serial_nr']").text(data_localize.matricule);
                            matricule_serial_nr = decodeData.matricule;//information;
                        }
                        else {
                            $("label[for='single_wheel_standard_format_Input_Serial_nr']").text(data_localize.serial_nr);
                            matricule_serial_nr = decodeData.sn;

                        }
                    }
                    ;

                    $("#single_wheel_standard_format_Input_Cai").val(cai);
                    $("#single_wheel_standard_format_Input_Serial_nr").val(matricule_serial_nr);
                    loader.hide();
                })
            }
            else {
                iProbe.tpmsOff();
                loader.hide();
                info_box.show(data_localize.tpms_not_find);
            }

        })

    });

    $("#single_wheel_standard_format_Button_Log_data").unbind().click(function() {

        if (sessionStorage.getItem("inspected_wheels") !== null) {
            sessionStorage.setItem("inspected_wheels", sessionStorage.getItem("inspected_wheels") + ";" + selected_wheel);
        } else {
            sessionStorage.setItem("inspected_wheels", selected_wheel);
        }

        logData();
    });
    
    $("#single_wheel_standard_format_Button_take_photo").unbind().click(function(){
        photo.take('single_wheel_standard_format_image',$("#single_wheel_standard_format_Input_Sensor_id").val());
    });
}