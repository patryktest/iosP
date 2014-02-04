var read_rfid = function() {

    var scan_rfid;

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

        scan_rfid = false;
    }

    function setValues() {
        var tyre_id_format = localStorage.getItem("tyre_id_format");

        if (tyre_id_format === 'michelin') {
            $("#read_rfid_Button_Tyre_id_format_s").hide();
            $("#read_rfid_Button_Tyre_id_format_m").show();
        } else {
            $("#read_rfid_Button_Tyre_id_format_s").show();
            $("#read_rfid_Button_Tyre_id_format_m").hide();
        }


    }

    function clearValues() {
        $("#read_rfid_Input_Cai").val("");
        $("#read_rfid_Input_Company").val("");
        $("#read_rfid_Input_Partition").val("");
        $("#read_rfid_Input_Filter").val("");
        $("#read_rfid_Input_Header").val("");

        $("#read_rfid_Input_Matricule").val("");
        $("#read_rfid_Input_Serial_nr").val("");
        $("#read_rfid_Input_Data_encoding").val("");
    }

    $("#read_rfid_Button_Scan_rfid").unbind('click').click(function() {
        
        scan_rfid = !scan_rfid;
        if (scan_rfid) {
            $('#read_rfid_Button_Scan_rfid span span span').text(data_localize.cancel_scan_rfid);
            clearValues();
            loader.show(data_localize.Scanning);
            iProbe.callBackOnrfidNoTagFoundResponse = onNoTagsFound;

            iProbe.readRFIDContinuous(function(data) {

                var epc_header = data.EPCheader;
                var cai = data.cai;
                var company_prefix = data.companyPrefix;
                var partition = data.partition;
                var serial_number = data.sn;
                var filter = data.filter;
                var matricule = '';//data.michelin;
                var encodingData = data.encodedData;

                $("#read_rfid_Input_Cai").val(cai);
                $("#read_rfid_Input_Company").val(company_prefix);
                $("#read_rfid_Input_Partition").val(partition);
                $("#read_rfid_Input_Filter").val(filter);
                $("#read_rfid_Input_Header").val(epc_header);

                $("#read_rfid_Input_Matricule").val(matricule);
                $("#read_rfid_Input_Serial_nr").val(serial_number);
                $("#read_rfid_Input_Data_encoding").val(encodingData);

            });
        } else {
            $('#read_rfid_Button_Scan_rfid span span span').text(data_localize.scan_rfid);
            iProbe.rfidOff(function() {});
            loader.hide();
            iProbe.callBackOnrfidNoTagFoundResponse = null;
            

        }
    });

    $("#read_rfid_Button_Read_rfid").unbind('click').click(function() {
        clearValues();
        loader.show(data_localize.Reading);
        iProbe.callBackOnrfidNoTagFoundResponse = onNoTagsFound;

        iProbe.readRFID(function(data) {

            var epc_header = data.EPCheader;
            var cai = data.cai;
            var company_prefix = data.companyPrefix;
            var partition = data.partition;
            var serial_number = data.sn;
            var filter = data.filter;
            var matricule = "";//data.michelin;
            var encodingData = data.encodedData;
            
            loader.hide();
            if(data.michelin){
                loader.show(data_localize.Reading);
                iProbe.readRFIDMatricule(function(data){
                    matricule = data;
                    $("#read_rfid_Input_Matricule").val(matricule);
                    loader.hide();
                });
            }
            
            $("#read_rfid_Input_Cai").val(cai);
            $("#read_rfid_Input_Company").val(company_prefix);
            $("#read_rfid_Input_Partition").val(partition);
            $("#read_rfid_Input_Filter").val(filter);
            $("#read_rfid_Input_Header").val(epc_header);

            $("#read_rfid_Input_Matricule").val(matricule);
            $("#read_rfid_Input_Serial_nr").val(serial_number);
            $("#read_rfid_Input_Data_encoding").val(encodingData);
            
            iProbe.callBackOnrfidNoTagFoundResponse = null;

            //$("#read_rfid_Input_Matricule").val(temperature);
        });
    });

    function onNoTagsFound() {
        scan_rfid = false;
        $('#read_rfid_Button_Scan_rfid span span span').text(data_localize.scan_rfid);
        iProbe.callBackOnrfidNoTagFoundResponse = null;
        loader.hide();
        info_box.show(data_localize.rfid_tag_not_found);
        //navigator.notification.alert(data_localize.rfid_tag_not_found, null, data_localize.alert, data_localize.ok);

    }
}