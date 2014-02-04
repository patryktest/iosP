var fleet_inspection = function() {
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
        setSelectVehicle();
    }

    function setValues() {
        var vehicle_list = localStorage.getItem("vehicle_list");
        if (vehicle_list !== null) {
            $("#fleet_inspection_Selected_Vehicle_list").text(vehicle_list);
        }

        var tyre_id_format = localStorage.getItem("tyre_id_format");
        if (tyre_id_format === 'michelin') {
            $("#fleet_inspection_Button_Tyre_id_format_s").hide();
            $("#fleet_inspection_Button_Tyre_id_format_m").show();
        } else {
            $("#fleet_inspection_Button_Tyre_id_format_s").show();
            $("#fleet_inspection_Button_Tyre_id_format_m").hide();
        }
    }

    function setSelectVehicle() {
        var vehicle_list = window.localStorage.getItem("vehicle_list");
        if (vehicle_list === undefined && vehicle_list !== '') {
            alert('Select vehicle list!');
            return false;
        }
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM vehicle JOIN vehicle_list ON vehicle_list.id = vehicle.id_vehicle_list WHERE vehicle_list = "' + vehicle_list + '" ', [], function(tx, results) {
                $('#fleet_inspection_Select_Vehicle').empty();
                $('#fleet_inspection_Select_Vehicle').append('<option value="" data-placeholder="true">Choose one...</option>');

                var len = results.rows.length, i;
                for (i = 0; i < len; i++) {
                    $('#fleet_inspection_Select_Vehicle').append(new Option(results.rows.item(i).name, results.rows.item(i).name));
                }
                $("#fleet_inspection_Select_Vehicle").selectmenu("refresh");
            });
        });

        function querySuccess(tx, results) {
        }

        function errorCB(err) {
        }
    }



    $('#fleet_inspection_Button_Set_vehicle').click(function() {
        var vehicle = $('#fleet_inspection_Select_Vehicle').val();

        if (vehicle === '') {
            return false;
        }

        sessionStorage.fleet_inspection_selected_vehicle = vehicle;
    });
}

