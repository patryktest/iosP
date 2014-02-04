var licenceKey = {
    database: window.openDatabase('iprobeDB', '1.0', 'iprobe DB', 2 * 1024 * 1024),
    options: {
        enterLicenceKeyPage: "#page_enter_licence_key",
        redirectValidLicenceKeyPage: "#page_main_menu"
    },
    init: function() {
        licenceKey.database.transaction(function(tx) {
            //tx.executeSql('DROP TABLE licenceKey');
            tx.executeSql('CREATE TABLE IF NOT EXISTS licenceKey (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, activated INTEGER(1) NOT NULL)');
        });

        $("#enter_licence_key_Grid_Licence_key input").keyup(licenceKey.licenceKeyKeyUp);
        $("#enter_licence_key_Button_CheckKey").click(licenceKey.checkKey);

        licenceKey.checkActivated();
    },
    checkActivated: function() {

        function redirect(_location) {
//            $.mobile.loading('hide', {text: "", textVisible: false, theme: 'a', html: ""});
            $.mobile.changePage(_location, {transition: "none", reloadPage: false, changeHash: true});
        }

        licenceKey.database.transaction(function(tx) {
//            $.mobile.loading('show', {text: "", textVisible: false, theme: 'a', html: ""});
            tx.executeSql('SELECT activated FROM licenceKey LIMIT 1', [], function(tx, results) {
                if (results.rows.length === 0) {
                    redirect(licenceKey.options.enterLicenceKeyPage);
                } else if (results.rows.item(0).activated === 1) {
                    redirect(licenceKey.options.redirectValidLicenceKeyPage);
                } else {
                    redirect(licenceKey.options.enterLicenceKeyPage);
                }
            }, function() {
                redirect(licenceKey.options.enterLicenceKeyPage);
            });
        });
    },
    isValid: function(_licenceKey) {

        if (_licenceKey === "RS5XU-56T2Y-M21PQ") {
            licenceKey.database.transaction(function(tx) {
                //tx.executeSql('DELETE FROM licenceKey', null, null);
                tx.executeSql('INSERT INTO licenceKey (activated) VALUES (?)', ['1'], null, null);
            });
            return true;
        } else {
            return false;
        }

    },
    licenceKeyKeyUp: function() {
        var value = $(this).val();
        var part = $(this).attr("id")[$(this).attr("id").length - 1];
        if (value.length === 5 && part !== 3) {
            $("#enter_licence_key_Input_Licence_key_part" + (++part)).focus();
        }
    },
    checkKey: function() {
        function isValidLicenceKeyPart(_part) {
            if (_part === '' || _part.length !== 5 || _part === undefined) {
                return false;
            }
            return true;
        }

        var part1 = $("#enter_licence_key_Input_Licence_key_part1").val();
        var part2 = $("#enter_licence_key_Input_Licence_key_part2").val();
        var part3 = $("#enter_licence_key_Input_Licence_key_part3").val();

        if (isValidLicenceKeyPart(part1) && isValidLicenceKeyPart(part2) && isValidLicenceKeyPart(part3)) {
            var licence_key = part1 + "-" + part2 + "-" + part3;
            if (licenceKey.isValid(licence_key)) {
                licenceKey.checkActivated();
            } else {
                //licenceKey.setMessage("xxx", "error");
            }
        } else {
            //licenceKey.setMessage("xxx", "error");
        }
    }
    /*setMessage: function(_text, _type) {
     var after = $("#enter_licence_key_Button_CheckKey").after($("<div id='time_Message'></div>").text(_text).addClass(_type));
     setTimeout(function() {
     $('#time_Message').fadeOut('slow', function() {
     $('#time_Message').remove();
     });
     }, 3000);
     }*/
};

