var initializing_tpms_sensor = function() {

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
        var tyre_id_format = localStorage.getItem("tyre_id_format");
        if (tyre_id_format === 'michelin') {
            $("#initializing_tpms_sensor_Button_Tyre_id_format_s").hide();
            $("#initializing_tpms_sensor_Button_Tyre_id_format_m").show();
        } else {
            $("#initializing_tpms_sensor_Button_Tyre_id_format_s").show();
            $("#initializing_tpms_sensor_Button_Tyre_id_format_m").hide();
        }

        $("#initializing_tpms_sensor_Input_Cai").val("");
        $("#initializing_tpms_sensor_Input_Serial_nr").val("");
        $("#initializing_tpms_sensor_Input_Company").val("");
        $("#initializing_tpms_sensor_Input_Matricule").val("");
        $("#initializing_tpms_sensor_Input_tpms_id").val("");
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

    $("#initializing_tpms_sensor_Button_Read_rfid").unbind('click').click(function() {
        $(this).css("background", "red");

        var cai;
        var matricule;
        var serial_nr;
        var company;

        cai = 0;
        matricule = 0;
        serial_nr = 0;
        company = 0;

        loader.show(data_localize.Reading);
        iProbe.readRFID(function(data) {
            console.log(data);
            cai = data.cai;
            company = data.companyPrefix;
            serial_nr = data.sn;
            //matricule = data.michelin;
            loader.hide();
            
            if(data.michelin){
                loader.show(data_localize.Reading);
                iProbe.readRFIDMatricule(function(data){
                    matricule = data;
                    $("#initializing_tpms_sensor_Input_Matricule").val(matricule);
                    loader.hide();
                });
            }
                

            $("#initializing_tpms_sensor_Input_Cai").val(cai);
            $("#initializing_tpms_sensor_Input_Serial_nr").val(serial_nr);
            $("#initializing_tpms_sensor_Input_Company").val(company);
            //$("#initializing_tpms_sensor_Input_Matricule").val(matricule);
            
        });

        $(this).css("background", "orange");
        $(this).css("background", "");
    });

    $("#initializing_tpms_sensor_Button_Get_tpms").unbind('click').click(function() {
        $(this).css("background", "red");

        var tpms_id;

        tpms_id = 0;

        loader.show(data_localize.Reading);
        iProbe.tpmsReadFrame(function(data) {

            if (data[0] != null) {
                tpms_id = data[0].id;
            }
            $("#initializing_tpms_sensor_Input_tpms_id").val(tpms_id);
            loader.hide();
        })



        $(this).css("background", "");
    });

    $("#initializing_tpms_sensor_Button_Send_rfid_data_to_tpms_sensor").unbind('click').click(function() {
        $(this).css("background", "red");

        var cai = $("#initializing_tpms_sensor_Input_Cai").val();
        var matricule = $("#initializing_tpms_sensor_Input_Matricule").val();
        var serial_nr = $("#initializing_tpms_sensor_Input_Serial_nr").val();
        var company = $("#initializing_tpms_sensor_Input_Company").val();
        var tpms_id = $("#initializing_tpms_sensor_Input_tpms_id").val();
        var encodedData;

        $(this).css("background", "");
        if(matricule.length==9){
            console.log('data send to encode cai:' + cai + ' matricule: ' + matricule + ' id: ' + tpms_id);
            encodedData = encodeMichelinDataWUS(cai, matricule);
        }
        else{
            console.log('data send to encode cai:' + cai + ' serial: ' + serial_nr + ' id: ' + tpms_id);
            encodedData = encodeStandartDataWUS(1, cai, serial_nr);
        }
        

        loader.show(data_localize.Working);
        iProbe.tpmsWriteInfo(tpms_id, encodedData, function(data) {
            console.log('write succes')
            $("#initializing_tpms_sensor_Div_Write_verified").removeClass("circle_silver");
            $("#initializing_tpms_sensor_Div_Write_verified").addClass("circle_green");
            loader.hide();
            setMessage(data_localize.RFID_data_were_sent_to_TPMS_sensor, "info", null, "initializing_tpms_sensor_Button_Send_rfid_data_to_tpms_sensor");
        });
    });


}

