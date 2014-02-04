var parameters = function() {
    var db = window.openDatabase('iprobeDB', '1.0', 'iprobe DB', 2 * 1024 * 1024);

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
        var type_id_format = localStorage.getItem("tyre_id_format");
        var pressure = localStorage.getItem("units_pressure");
        var temperature = localStorage.getItem("units_temperature");
        var language = localStorage.getItem("language");

        if (type_id_format !== null) {
            $('#parameters_Select_Tyre_id_format option[value="' + type_id_format + '"]').prop('selected', true);
            $("#parameters_Select_Tyre_id_format").selectmenu("refresh");
        }

        if (pressure !== null) {
            $('#parameters_Select_Pressure option[value="' + pressure + '"]').prop('selected', true);
            $("#parameters_Select_Pressure").selectmenu("refresh");
        }

        if (temperature !== null) {
            $('#parameters_Select_Temperature option[value="' + temperature + '"]').prop('selected', true);
            $("#parameters_Select_Temperature").selectmenu("refresh");
        }

        if (language !== null) {
            $('#parameters_Select_Select_language option[value="' + language + '"]').prop('selected', true);
            $("#parameters_Select_Select_language").selectmenu("refresh");
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

    $("#parameters_Select_Tyre_id_format").change(function() {
        var type_id_format = $(this).val();
        localStorage.setItem("tyre_id_format", type_id_format);
    });

    $("#parameters_Button_Clear_log").unbind().click(function() {
        if (confirm(data_localize.are_you_sure_you_want_to_clear_the_log_file, data_localize.clear_log)) {
            db.transaction(function(tx) {
                tx.executeSql('DELETE FROM log', [], function(tx, results) {
                    synchTableFile.synchInspectionLog();
                    setMessage(data_localize.log_file_has_been_cleared, "info", null, "parameters_Button_Clear_log");
                });
            });
        }
    });

    $("#parameters_Button_P").click(function() {
        iProbe.getDeviceNumber(function(data) {
            var probe_id = data;
            $("#parameters_Message").text(probe_id);
        })

    });

    $("#parameters_Button_S").click(function() {
        var probe_software_version_and_date = null;

		iProbe.getDeviceSWVersion(function(data) {
            var probe_software_version_and_date = data;
            $("#parameters_Message").text(probe_software_version_and_date);
        })
        
    });

    $("#parameters_Button_B").click(function() {
        iProbe.getBatteryInfo(function(data) {
            var probe_battery_voltage = data + ' V';
            $("#parameters_Message").text(probe_battery_voltage);
        })

    });

    $("#parameters_Button_T").click(function() {
        iProbe.tpmsVersion(function(data) {
            var tpms_module_firmware = data;
            $("#parameters_Message").text(tpms_module_firmware);
        })

    });

    $("#parameters_Select_Pressure").change(function() {
        var pressure = $(this).val();
        localStorage.setItem("units_pressure", pressure);
    });

    $("#parameters_Select_Temperature").change(function() {
        var temperature = $(this).val();
        localStorage.setItem("units_temperature", temperature);
    });

    $("#parameters_Select_Select_language").change(function() {
        var language = $(this).val();
        localStorage.setItem("language", language);

        $.mobile.changePage("#page_main_menu", {transition: "none", reloadPage: false, allowSamePageTransition: true, changeHash: true});
    });
}


