var read_tpms = function() {

    var multi_read_tpms_sensor = sessionStorage.getItem("multi_read_tpms_sensor");
    sessionStorage.removeItem("multi_read_tpms_sensor");
    var tyre_id_format = localStorage.getItem("tyre_id_format");

    /**
     * 
     */
    initialize();
    /*
     * 
     */

    function initialize() {
        setValues();
        clearValues();
    }

    function setValues() {

        if (tyre_id_format === 'michelin') {
            $("#read_tpms_Button_Tyre_id_format_s").hide();
            $("#read_tpms_Button_Tyre_id_format_m").show();
        } else {
            $("#read_tpms_Button_Tyre_id_format_s").show();
            $("#read_tpms_Button_Tyre_id_format_m").hide();
        }

        $("#read_tpms_Input_Sensor_id").val(multi_read_tpms_sensor);



        var stop_after = sessionStorage.getItem("read_tpms_stop_after");
        if (stop_after !== null) {
            $("#read_tpms_Number_Stop_after").val(stop_after);
        }
    }

    function clearValues() {
        $("#read_tpms_Input_Pressure").val('');
        $("#read_tpms_Input_Temperature").val('');
        $("#read_tpms_Input_Cai").val('');
        $("#read_tpms_Input_Matricule").val('');
        $("#read_tpms_Input_Serial_nr").val('');
    }

    $("#read_tpms_Button_Read_tpms").unbind('click').click(function() {
        clearValues();
        var sensor_id;
        var pressure;
        var temperature;

        var cai;
        var matricule;
        var serial_nr;

        cai = 0;
        matricule = '';
        serial_nr = '';

        loader.show(data_localize.Reading);

        iProbe.tpmsReadFrame(function(data) {
            sensor_id = 0;
            pressure = 0;
            temperature = 0;


            if (data[0] != null) {
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

            $("#read_tpms_Input_Sensor_id").val(sensor_id);
            $("#read_tpms_Input_Pressure").val(pressure);
            $("#read_tpms_Input_Temperature").val(temperature);
            if (sensor_id != 0) {
                console.log('start read info from tpms senID: ' + sensor_id);
                iProbe.tpmsReadInfo(sensor_id, function(data) {
                    var information = null;
                    var decodeData = null;

                    if (data[0] != null) {
                        sensor_id = data[0].id;
                        information = data[0].information;                        
                        decodeData = decodeWUS(information);
                        if(decodeData.michelin)
                            matricule = decodeData.matricule;
                        else
                            serial_nr = decodeData.sn;
                        cai = decodeData.cai;
                        
                        
                    }
                    ;

                    $("#read_tpms_Input_Cai").val(cai);
                    $("#read_tpms_Input_Matricule").val(matricule);
                    $("#read_tpms_Input_Serial_nr").val(serial_nr);
                    loader.hide();
                })
            }
            else{
                iProbe.tpmsOff();
                loader.hide();
                clearValues();
                info_box.show(data_localize.tpms_not_find);
            }

        })



        /*if (tyre_id_format === "michelin") {
         $("#read_tpms_Input_Matricule").val(matricule);
         } else {
         $("#read_tpms_Input_Serial_nr").val(serial_nr);
         }*/
    });

    $("#read_tpms_Number_Stop_after").change(function() {
        var stop_after = $(this).val();
        sessionStorage.setItem("read_tpms_stop_after", stop_after);
    });
}