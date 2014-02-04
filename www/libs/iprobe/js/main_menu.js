var main_menu = function() {
    var device;

    /**
     * 
     */
    initialize();
    /*
     * 
     */

    function initialize() {
        setLanguage();
//        initBluetooth();
        /*if (initBt != true) {
         initBluetooth();
         }*/
        setValues();
    }

    function setValues() {
        var tyre_id_format = localStorage.getItem("tyre_id_format");
        if (tyre_id_format === 'michelin') {
            $("#main_menu_Button_Tyre_id_format_s").hide();
            $("#main_menu_Button_Tyre_id_format_m").show();
        } else {
            $("#main_menu_Button_Tyre_id_format_s").show();
            $("#main_menu_Button_Tyre_id_format_m").hide();
        }

        $("#connect_Button").unbind('click').click(bluetoothConnect);
        $("#disconnect_Button").unbind('click').click(bluetoothDisconnect);

        if (sessionStorage.getItem("device") !== undefined && sessionStorage.getItem("device") !== null && sessionStorage.getItem("device") !== "") {
            $('#select_bluetooth_device option[value="' + sessionStorage.getItem("device") + '"]').prop('selected', true);
            $("#select_bluetooth_device").selectmenu("refresh");
        }
    }


    $("#main_menu_Button_Exit").click(function() {
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        }
    });


}

//var initBt = false;
function initBluetooth() {
    console.log('init bluetooth');
    iProbe.getDeviceList(onDeviceList, onError);

    /*bluetoothSerial.isEnabled(function(enabled) {
        console.log('bt is enabled');

        if (enabled === "OK" || enabled === true) {
            $("#main_menu_Div_Bt_indicate").removeClass("bt_indicate_nonactive");
            $("#main_menu_Div_Bt_indicate").addClass("bt_indicate_active");

        }
    }, function() {
        console.log('bt is not enabled');

        $("#main_menu_Div_Bt_indicate").removeClass("bt_indicate_active");
        $("#main_menu_Div_Bt_indicate").addClass("bt_indicate_nonactive");
    });*/

    bluetoothSerial.isConnected(function(connected) {
        console.log('is connected');

        if (connected === "OK" || connected === true) {
            $("#connect_Button").hide();
            $("#disconnect_Button").show();

            /*$("#main_menu_Div_Tpms_indicate").removeClass("tpms_indicate_nonactive");
            $("#main_menu_Div_Tpms_indicate").addClass("tpms_indicate_active");*/
        }
    }, function() {
        console.log('is not connected');

        $("#disconnect_Button").hide();
        $("#connect_Button").show();

        $("#main_menu_Div_Tpms_indicate").removeClass("tpms_indicate_active");
        $("#main_menu_Div_Tpms_indicate").addClass("tpms_indicate_nonactive");
    });

    //initBt = true;
}


function onDeviceList(data) {

    select_bluetooth_device.innerHTML = "";
    console.log(data);
    data.forEach(function(device) {
        option = document.createElement("option");
        if (device.hasOwnProperty("address")) {
            option.value = device.address;
        } else {
            option.value = "ERROR " + JSON.stringify(device);
        }
        option.innerHTML = device.name;
        sessionStorage.setItem("device", device.address);
        select_bluetooth_device.appendChild(option);
    });

    if (data.length === 0) {
        option = document.createElement('option');
        option.innerHTML = "No Bluetooth Devices";
        select_bluetooth_device.appendChild(option);
    }
    $("#select_bluetooth_device").selectmenu("refresh");

}

function onError() {
    //console.log('Err');
}

function bluetoothConnect() {
    loader.show(data_localize.Connecting);
    console.log('send connect');
    device = select_bluetooth_device[select_bluetooth_device.selectedIndex].value;
    iProbe.connect(device, onConnectToDevice, onConnectionError);
}
function bluetoothDisconnect() {
    console.log('send disconnect');
    iProbe.disconnect(onDisconnectFromDevice, onConnectionError);
}

function onConnectToDevice() {
    loader.hide();
    console.log('On connect');
    
    $("#main_menu_Div_Bt_indicate").removeClass("bt_indicate_nonactive");
    $("#main_menu_Div_Bt_indicate").addClass("bt_indicate_active");
    
    window.setTimeout(function(){
        iProbe.getDeviceNumber(function(data) {
        var probe_id = data;
        $("#main_menu_Message").text(data_localize.probe_id + ": " + probe_id);
        $("#main_menu_Div_Tpms_indicate").removeClass("tpms_indicate_nonactive");
        $("#main_menu_Div_Tpms_indicate").addClass("tpms_indicate_active");
    });
    }, 1000);
    

    sessionStorage.setItem("device", device);

    $("#connect_Button").hide();
    $("#disconnect_Button").show();

    
}

function onDisconnectFromDevice() {
    console.log('on disconnect');
    sessionStorage.removeItem("device");
//    connection_status_label.innerHTML = "disconnected";
//    $("#connect_Button").unbind('click').click(bluetoothConnect);

    $("#main_menu_Message").text(data_localize.disconect);

    $("#disconnect_Button").hide();
    $("#connect_Button").show();

    $("#main_menu_Div_Tpms_indicate").removeClass("tpms_indicate_active");
    $("#main_menu_Div_Tpms_indicate").addClass("tpms_indicate_nonactive");
}

function onConnectionError() {
    loader.hide();
    info_box.show(data_localize.connection_failed);
    console.log('connection_failed');
}
    