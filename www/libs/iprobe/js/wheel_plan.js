var wheel_plan = function() {
    var db = window.openDatabase('iprobeDB', '1.0', 'iprobe DB', 2 * 1024 * 1024);
//    var resizeTime = 100;
//    var resizeDelay = 100;
    var vehicle_name = sessionStorage.getItem("fleet_inspection_selected_vehicle");
//    var wheel_plan_4x2, wheel_plan_6x2;
    var type;
    db.transaction(function(tx) {
//        tx.executeSql('DROP TABLE log');
        tx.executeSql('CREATE TABLE IF NOT EXISTS log (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, cai CHAR(50) NOT NULL, matricule_serial_nr CHAR(10) NOT NULL, date_time CHAR(20) NOT NULL, vehicleNr CHAR(50) NOT NULL, position CHAR(10) NOT NULL, pressure CHAR(10) NOT NULL, temperature CHAR(10) NOT NULL, tDext FLOAT(5) NOT NULL, tDmid FLOAT(5) NOT NULL, tDint FLOAT(5) NOT NULL, sensor_id CHAR(50) NOT NULL, comment CHAR(255) NOT NULL)');
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
        $(".wheel").removeClass("hover");
        $(".wheel").removeClass("highlight");

        var interval = setInterval(function() {
            highlightWheel();
            clearTimeout(interval)
        }, 500);

    }

    function setValues() {
        db.transaction(function(tx) {
            tx.executeSql('SELECT id, name, type FROM vehicle WHERE name = ?', [vehicle_name], function(tx, results) {
                setWheelPlan(results.rows.item(0).type);
                $("#wheel_plan_Input_Vehicle_id").val(vehicle_name);
            });
        });
    }

    function setWheelPlan(arg_type) {
        $('#wheel_plan_Img_Wheel_plan_4x2').hide();
        $('#wheel_plan_Img_Wheel_plan_6x2').hide();
        $('#wheel_plan_Img_Wheel_plan_3x8a').hide();
        $('#wheel_plan_Img_Wheel_plan_3x8b').hide();
        $('#wheel_plan_Img_Wheel_plan_4x12').hide();
        $('#wheel_plan_Img_Wheel_plan_4x14').hide();

        /*$('.wheel.4x2').hide();
         $('.wheel.6x2').hide();*/
        $('.wheel.dual').hide();

        switch (arg_type) {
            case '4x2':
                $('#wheel_plan_Img_Wheel_plan_4x2').show();
                $('.wheel.4x2').show();
                break;
            case '6x2':
                $('#wheel_plan_Img_Wheel_plan_6x2').show();
                $('.wheel.6x2').show();
                break;
            case '3x8a':
                $('#wheel_plan_Img_Wheel_plan_3x8a').show();
                $('.wheel.3x8a').show();
                break;
            case '3x8b':
                $('#wheel_plan_Img_Wheel_plan_3x8b').show();
                $('.wheel.3x8b').show();
                break;
            case '4x12':
                $('#wheel_plan_Img_Wheel_plan_4x12').show();
                $('.wheel.4x12').show();
                break;
            case '4x14':
                $('#wheel_plan_Img_Wheel_plan_4x14').show();
                $('.wheel.4x14').show();
                break;

        }
        type = arg_type;
        controlFinishedInspection();
    }

    function highlightWheel() {
        var highlight = new Array();
        var inspected_wheels = sessionStorage.getItem("inspected_wheels");

        if (inspected_wheels !== null) {
            inspected_wheels = inspected_wheels.split(";");

            for (i = 0; i < inspected_wheels.length; i++) {
                if (inspected_wheels !== null) {

                    if (highlight.indexOf(inspected_wheels[i]) === -1) {
                        highlight[highlight.length] = inspected_wheels[i];
                        $("div[wheel-position *= " + inspected_wheels[i] + "]").addClass('highlight');
                    }
                }
            }
        }
    }

    function setWheelPlanImage(wheel) {

        $(wheel).toggleClass("hover");

        //var id = $(this).attr("id")
        var wheel_position = $(wheel).attr("wheel-position")

        //var tyre_id_format = localStorage.getItem("tyre_id_format");
        var single_dual;
        if (wheel_position.length === 2) {
            single_dual = "single";
        } else {
            single_dual = "dual";

            wheel_positions = wheel_position.split("-");
            wheel_position = wheel_positions[0];
        }

        sessionStorage.wheel_plan_Selected_wheel = wheel_position;

        var location;

        /*if (tyre_id_format === "michelin") {
         if (single_dual === "single") {
         location = '#page_single_wheel_michelin_format';
         } else {
         location = '#page_dual_wheel_tpms_read';
         }
         } else if (tyre_id_format === "standard") {
         if (single_dual === "single") {
         location = '#page_single_wheel_standard_format';
         } else {
         location = '#page_dual_wheel_tpms_read';
         }
         } else {*/
        if (single_dual === "single") {
            location = '#page_single_wheel_standard_format';
        } else {
            location = '#page_dual_wheel_tpms_read';
        }
        //}

        $.mobile.changePage(location, {transition: "none", reloadPage: false, changeHash: true});
    }

    $(".wheel").unbind().click(function() {
        setWheelPlanImage(this);
    });

    function controlFinishedInspection() {
        var inspected_wheels = sessionStorage.getItem("inspected_wheels");
        if (inspected_wheels !== null) {
            inspected_wheels = inspected_wheels.split(";");
            if (type === '4x2' && inspected_wheels.length === 4) {
                endWheelInspecion();
            }
            else if ((type === '6x2' || type === '3x8a' || type === '3x8b') && inspected_wheels.length === 6) {
                endWheelInspecion();
                
            }
            else if ((type === '4x12' || type === "4x14") && inspected_wheels.length === 8) {
                endWheelInspecion();
            }

        }
    }

    function endWheelInspecion() {
        var timeout = setTimeout(function() {
            $.mobile.changePage("#page_fleet_inspection", {transition: "none", changeHash: true});
        }, 3200);
        info_box_ok.show(data_localize.vehicle_reading_completed, data_localize.ok, function() {
            clearTimeout(timeout);
            $.mobile.changePage("#page_fleet_inspection", {transition: "none", changeHash: true});
        });
    }

}