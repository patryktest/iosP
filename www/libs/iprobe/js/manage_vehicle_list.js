var manage_vehicle_list = function() {
    var db = window.openDatabase('iprobeDB', '1.0', 'iprobe DB', 2 * 1024 * 1024);

    db.transaction(function(tx) {

    });

    /**
     * 
     */
    initialize();
    /*
     * 
     */

    function initialize() {
        setValues();
        setSelectVehicleList();
        setSelectVehicle();
    }

    function setValues() {
        var vehicle_list = window.localStorage.getItem("vehicle_list");
        if (vehicle_list !== '') {
            $('#manage_vehicle_list_Input_Actual_vehicle_list').val(vehicle_list);
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

    /*
     * Naplni selectbox vehicle list
     */
    function setSelectVehicleList() {
        var vehicle_list = window.localStorage.getItem("vehicle_list");
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM vehicle_list', [], function(tx, results) {
                $('#manage_vehicle_list_Select_Vehicle_list').empty();
                $('#manage_vehicle_list_Select_Vehicle_list').append('<option value="" data-placeholder="true">Choose one...</option>');

                var len = results.rows.length, i;
                for (i = 0; i < len; i++) {
                    $('#manage_vehicle_list_Select_Vehicle_list').append(new Option(results.rows.item(i).vehicle_list, results.rows.item(i).vehicle_list));
                }
                if (vehicle_list !== undefined && vehicle_list !== '') {
                    $('#manage_vehicle_list_Select_Vehicle_list option[value="' + vehicle_list + '"]').prop('selected', true);
                }
                $("#manage_vehicle_list_Select_Vehicle_list").selectmenu("refresh");
            });
        });
    }

    /*
     * Prida novy vehicle list 
     */
    function addVehicleList(vehicle_list) {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO vehicle_list (vehicle_list) VALUES (?)', [vehicle_list], querySuccess, errorCB);
        });

        function querySuccess(tx, results) {
            synchTableFile.createFile("Translogik iProbe/Vehicle Lists/" + vehicle_list + ".txt")
            $("#manage_vehicle_list_Input_Add_vehicle_list").val("");
            setMessage(data_localize.vehicle_list_has_been_added, "info", null, "manage_vehicle_list_Button_Add_vehicle_list");
            console.log("Vehicle list has been added");
        }

        function errorCB(err) {
            setMessage(data_localize.vehicle_list_has_not_been_added, "error", null, "manage_vehicle_list_Button_Add_vehicle_list");
            console.error("Vehicle list was not added");
        }
    }

    /*
     * Zmaze vehicle list
     */
    function removeVehicleList(vehicle_list) {
        if (confirm(data_localize.are_you_sure_to_remove_list + " " + vehicle_list + "?")) {
            db.transaction(function(tx) {
                tx.executeSql('DELETE FROM vehicle_list WHERE vehicle_list = (?)', [vehicle_list], querySuccess, errorCB);
            });
        }
        function querySuccess(tx, results) {
            var actual_vehicle_list = window.localStorage.getItem("vehicle_list");
            if (vehicle_list === actual_vehicle_list) {
                window.localStorage.removeItem("vehicle_list");
                window.localStorage.getItem("vehicle_list");
                $('#manage_vehicle_list_Input_Actual_vehicle_list').val('');
            }
            synchTableFile.removeFile("Translogik iProbe/Vehicle Lists/" + vehicle_list + ".txt")
            setMessage(data_localize.vehicle_list_has_been_removed, "info", null, "manage_vehicle_list_Button_Remove_vehicle_list");
            console.log("Vehicle list was deleted");
        }

        function errorCB(err) {
            setMessage(data_localize.vehicle_list_has_not_been_removed, "error", null, "manage_vehicle_list_Button_Remove_vehicle_list");
            console.error("Vehicle list was not deleted");
        }
    }

    /*
     * Naplni selectbox vehicles pre aktualne zvoleny vehicle list
     */
    function setSelectVehicle() {
        var vehicle_list = window.localStorage.getItem("vehicle_list");
        if (vehicle_list === undefined && vehicle_list !== '') {
//            alert('Select vehicle list!');
            return false;
        }

        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM vehicle JOIN vehicle_list ON vehicle_list.id = vehicle.id_vehicle_list WHERE vehicle_list = "' + vehicle_list + '" ', [], function(tx, results) {
                $('#manage_vehicle_list_Select_Vehicle').empty();
                $('#manage_vehicle_list_Select_Vehicle').append('<option value="" data-placeholder="true">Choose one...</option>');

                var len = results.rows.length, i;
                for (i = 0; i < len; i++) {
                    $('#manage_vehicle_list_Select_Vehicle').append(new Option(results.rows.item(i).name, results.rows.item(i).name));
                }
                $("#manage_vehicle_list_Select_Vehicle").selectmenu("refresh");
            });
        });

        function querySuccess(tx, results) {
            console.log("Vehicle was selected");
        }

        function errorCB(err) {
            console.error("Vehicle was not selected");
        }
    }

    /*
     * Prida novy vehicle
     */
    function addVehicle(vehicle_list, vehicle_name, vehicle_type) {
        if (vehicle_list === null || vehicle_list === undefined || vehicle_list === '') {
            setMessage(data_localize.please_choose_the_vehicle_list, "warning", null, "manage_vehicle_list_Button_Add_vehicle");
            return false;
        }

        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO vehicle (name, type, id_vehicle_list) VALUES ("' + vehicle_name + '", "' + vehicle_type + '", (SELECT id FROM vehicle_list WHERE vehicle_list = "' + vehicle_list + '" LIMIT 1))', [], querySuccess, errorCB);
        });

        function querySuccess(tx, results) {
            $("#manage_vehicle_list_Input_Vehicle_id").val("");
            $("#manage_vehicle_list_Select_Wheel_plan option:first").attr('selected', 'selected');
            setSelectVehicle();
            synchTableFile.synchVehicleList(window.localStorage.getItem("vehicle_list"));
            setMessage(data_localize.vehicle_has_been_added, "info", null, "manage_vehicle_list_Button_Add_vehicle");
            console.log("Vehicle was added");
        }

        function errorCB(err) {
            setMessage(data_localize.vehicle_has_not_been_added, "error", null, "manage_vehicle_list_Button_Add_vehicle");
            console.error("Vehicle was not added");
        }
    }

    /*
     * Upravy zvoleny vehicle
     */
//    function updateVehicle(vehicle_name, vehicle_type) {
//        if (vehicle_name === undefined && vehicle_name !== '') {
//            alert('Select vehicle!');
//            return false;
//        }
//
//        db.transaction(function(tx) {
//            tx.executeSql('UPDATE vehicle SET type = ? WHERE name = "' + vehicle_name + '"', [vehicle_type], querySuccess, errorCB);
//        });
//
//        function querySuccess(tx, results) {
//            setSelectVehicle();
//            alert('Vehicle was updated.')
//        }
//
//        function errorCB(err) {
//            setMessage("manage_vehicle_list_Message", "error", "Vehicle was not updated!");
//        }
//    }

    /*
     * Odstrani zvoleny vehicle
     */
    function removeVehicle(vehicle_name) {
        if (vehicle_name === undefined && vehicle_name !== '') {
            return false;
        }

        if (confirm(data_localize.are_you_sure_you_want_to_remove_this_vehicle + " " + vehicle_name + "?")) {
            db.transaction(function(tx) {
                tx.executeSql('DELETE FROM vehicle WHERE name = (?)', [vehicle_name], querySuccess, errorCB);
            });
        }
        function querySuccess(tx, results) {
            synchTableFile.synchVehicleList(window.localStorage.getItem("vehicle_list"));
            setMessage(data_localize.vehicle_has_been_removed, "info", null, "manage_vehicle_list_Button_Remove_vehicle");
            console.log("Vehicle was deleted");
        }

        function errorCB(err) {
            setMessage(data_localize.vehicle_has_not_been_removed, "error", null, "manage_vehicle_list_Button_Remove_vehicle");
            console.error("Vehicle was not deleted");
        }
    }

    $('#manage_vehicle_list_Button_Add_vehicle_list').unbind().click(function() {
        var vehicle_list = $('#manage_vehicle_list_Input_Add_vehicle_list').val();

        if (vehicle_list !== '') {
            addVehicleList(vehicle_list);
            setSelectVehicleList();
        } else {
            setMessage(data_localize.please_enter_the_vehicle_list, "warning", null, "manage_vehicle_list_Button_Add_vehicle_list");
        }
    });

    $('#manage_vehicle_list_Button_Remove_vehicle_list').unbind().click(function() {
        var vehicle_list = $('#manage_vehicle_list_Select_Vehicle_list').val();
        if (vehicle_list !== '') {
            removeVehicleList(vehicle_list);
            setSelectVehicleList();
        } else {
            setMessage(data_localize.please_choose_the_vehicle_list, "warning", null, "manage_vehicle_list_Button_Remove_vehicle_list");
        }
    });

    $('#manage_vehicle_list_Button_Set_vehicle_list').unbind().click(function() {
        var vehicle_list = $('#manage_vehicle_list_Select_Vehicle_list').val();

        if (vehicle_list !== '') {
            window.localStorage.setItem("vehicle_list", vehicle_list);
            setSelectVehicle();
            $('#manage_vehicle_list_Input_Actual_vehicle_list').val(vehicle_list);
        } else {
            setMessage(data_localize.please_choose_the_vehicle_list, "warning", null, "manage_vehicle_list_Button_Set_vehicle_list");
        }
    });

    $('#manage_vehicle_list_Button_Add_vehicle').unbind().click(function() {
        var vehicle_list = window.localStorage.getItem("vehicle_list");
        var vehicle_name = $('#manage_vehicle_list_Input_Vehicle_id').val();
        var vehicle_type = $('#manage_vehicle_list_Select_Wheel_plan').val();

        if (vehicle_name !== '' && vehicle_type !== '') {
            addVehicle(vehicle_list, vehicle_name, vehicle_type);
            setSelectVehicle();
        } else {
            if (vehicle_name === '') {
                setMessage(data_localize.please_enter_the_vehicle_id, "warning", null, "manage_vehicle_list_Button_Add_vehicle");
            } else if (vehicle_type === '') {
                setMessage(data_localize.please_choose_the_vehicle_type, "warning", null, "manage_vehicle_list_Button_Add_vehicle");
            }
        }
    });

    $('#manage_vehicle_list_Button_Remove_vehicle').unbind().click(function() {
        var vehicle_name = $('#manage_vehicle_list_Select_Vehicle').val();
        if (vehicle_name !== '') {
            removeVehicle(vehicle_name);
            setSelectVehicle();
        } else {
            setMessage(data_localize.please_choose_the_vehicle, "warning", null, "manage_vehicle_list_Button_Remove_vehicle");
        }
    });
}


