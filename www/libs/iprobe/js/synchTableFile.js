var db = window.openDatabase('iprobeDB', '1.0', 'iprobe DB', 2 * 1024 * 1024);

    db.transaction(function(tx) {
//        tx.executeSql('DROP TABLE vehicle_list');
//        tx.executeSql('DROP TABLE vehicle');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vehicle_list (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, vehicle_list CHAR(50) NOT NULL UNIQUE )');
        tx.executeSql('CREATE TABLE IF NOT EXISTS vehicle (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name CHAR(50) NOT NULL, type CHAR(10) NOT NULL, id_vehicle_list INTEGER NOT NULL, FOREIGN KEY(id_vehicle_list) REFERENCES vehicle_list(id) ON DELETE CASCADE)');
    });
    
var synchTableFile = {
    init: function() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

        function gotFS(fileSystem) {
            fileSystem.root.getDirectory("Translogik iProbe", {create: true, exclusive: false}, onGetDirectorySuccess, onGetDirectoryFail);
            fileSystem.root.getDirectory("Translogik iProbe/Vehicle Lists", {create: true, exclusive: false}, onGetDirectorySuccess, onGetDirectoryFail);

            function onGetDirectorySuccess(dir) {
                console.log("Created dir " + dir.name);
            }

            function onGetDirectoryFail(error) {
                console.error("Error creating directory " + error.code);
            }
        }

        function fail(error) {
            console.error("Error requestFileSystem " + error.code);
        }
    },
    write: function(text, path) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

        function gotFS(fileSystem) {

            fileSystem.root.getFile(path, {create: true, exclusive: false}, gotFileEntry, gotFileEntryFail);

            function gotFileEntry(fileEntry) {

                fileEntry.createWriter(gotFileWriter, fail);

                function gotFileWriter(writer) {
                    writer.onwrite = function(evt) {
                        console.log("write success");
                    };
                    writer.write(text);
                }

                function fail(error) {
                    console.error("Error createWriter " + error.code);
                }
            }

            function gotFileEntryFail(error) {
                console.error("Error write to file " + error.code);

            }

            function fail(error) {
                console.error("Error requestFileSystem " + error.code);
            }
        }

        function fail(error) {
            console.error("Error requestFileSystem " + error.code);
        }
    },
    createFile: function(path) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

        function gotFS(fileSystem) {

            fileSystem.root.getFile(path, {create: true, exclusive: false}, gotFileEntry, gotFileEntryFail);

            function gotFileEntry(fileEntry) {
                console.log("Created file " + fileEntry.name);
            }

            function gotFileEntryFail(error) {
                console.error("Error create file " + error.code);
            }
        }

        function fail(error) {
            console.error("Error requestFileSystem " + error.code);
        }
    },
    removeFile: function(path) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

        function gotFS(fileSystem) {

            fileSystem.root.getFile(path, {create: true, exclusive: false}, gotFileEntry, gotFileEntryFail);

            function gotFileEntry(fileEntry) {

                fileEntry.remove(success, fail);

                function success(entry) {
                    console.log("Removal file succeeded");
                }
                function fail(error) {
                    console.error("Error removal file " + error.code);
                }
            }

            function gotFileEntryFail(error) {
                console.error("Error removal file " + error.code);
            }


        }

        function fail(error) {
            console.error("Error requestFileSystem " + error.code);
        }
    },
    synchVehicleListFromFile: function(path) {

        function readFile(name) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

            function addVehicles(vehicles_text) {

            }

            function gotFS(fileSystem) {
                fileSystem.root.getFile("Translogik iProbe/Vehicle Lists/" + name, null, gotFileEntry, fail);


                function gotFileEntry(fileEntry) {
                    fileEntry.file(gotFile, fail);


                    function gotFile(file) {
                        readAsText(file);
                    }

                    function readAsText(file) {
                        var reader = new FileReader();
                        reader.onloadend = function(evt) {
                            var vehicle_list = name.replace(".txt", "");
                            db.transaction(function(tx) {
                                tx.executeSql('SELECT * FROM vehicle_list WHERE vehicle_list = ?', [vehicle_list], function(tx, results) {
                                    if (results.rows.length > 0) {
                                        tx.executeSql('DELETE FROM vehicle WHERE id_vehicle_list = (SELECT id FROM vehicle_list WHERE vehicle_list = "' + vehicle_list + '" LIMIT 1)', [], querySuccess, null);
                                    } else {
                                        tx.executeSql('INSERT INTO vehicle_list (vehicle_list) VALUES (?)', [vehicle_list], querySuccess, null);
                                    }

                                    function querySuccess(tx, results) {
                                        var vehicles = evt.target.result.split("\n");
                                        for (i = 0; i < vehicles.length; i++) {
                                            if (vehicles[i] !== "") {
                                                var row = vehicles[i].split(",");
                                                var vehicle_name = row[0];
                                                var vehicle_type = row[1];

                                                if (vehicle_name !== undefined && vehicle_name !== "" && vehicle_type !== undefined && vehicle_type !== "") {
                                                    tx.executeSql('INSERT INTO vehicle (name, type, id_vehicle_list) VALUES ("' + vehicle_name + '", "' + vehicle_type + '", (SELECT id FROM vehicle_list WHERE vehicle_list = "' + vehicle_list + '" LIMIT 1))', [], function(tx, results) {
                                                        console.log(vehicle_name + " was added from file");
                                                    });
                                                }
                                            }
                                        }
                                    }
                                });
                            });
                        };
                        reader.readAsText(file);
                    }

                    function fail(evt) {
                        console.error(evt.target.error.code);
                    }
                }

                function fail(evt) {
                    console.error(evt.target.error.code);
                }
            }
            function fail(evt) {
                console.error(evt.target.error.code);
            }
        }

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

        function gotFS(fileSystem) {
            fileSystem.root.getDirectory(path, {create: true, exclusive: false}, getDirectoryEntry, getDirectoryEntryFail);

            function getDirectoryEntry(dirEntry) {
                // Get a directory reader
                var directoryReader = dirEntry.createReader();

                // Get a list of all the entries in the directory
                directoryReader.readEntries(success, fail);

                function success(entry) {
                    db.transaction(function(tx) {
                        tx.executeSql('DELETE FROM vehicle_list', [], null, null);
                    });

                    var i;
                    for (i = 0; i < entry.length; i++) {
                        var name = entry[i].name;
                        if (name.substr(name.length - 4, 4) === ".txt") {
                            readFile(name);
                        }
                    }

                }
                function fail(error) {
                    console.log("Error getDirectory " + error.code);
                }
            }

            function getDirectoryEntryFail(error) {
                console.log("Error requestFileSystem " + error.code);
            }
        }

        function fail(error) {
            console.log("Error requestFileSystem " + error.code);
        }
    },
    synchVehicleList: function(vehicleList) {
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM vehicle JOIN vehicle_list ON vehicle_list.id = vehicle.id_vehicle_list WHERE vehicle_list = ?', [vehicleList], function(tx, results) {

                var len = results.rows.length, i;
                var vehicles = "";

                for (i = 0; i < len; i++) {
                    vehicles += results.rows.item(i).name + "," + results.rows.item(i).type + "\n";
                }
                synchTableFile.write(vehicles, "Translogik iProbe/Vehicle Lists/" + vehicleList + ".txt");
            });
        });
    },
    synchInspectionLog: function() {
        db.transaction(function(tx) {
            tx.executeSql('SELECT cai, matricule_serial_nr, date_time, vehicleNr, position, pressure, temperature, tDext, tDmid, tDint, sensor_id, comment FROM log', [], function(tx, results) {

                var len = results.rows.length, i;
                var logs = "";

                for (i = 0; i < len; i++) {
                    logs += results.rows.item(i).cai + ", " +
                            results.rows.item(i).matricule_serial_nr + ", " +
                            results.rows.item(i).date_time + ", " +
                            results.rows.item(i).vehicleNr + ", " +
                            results.rows.item(i).position + ", " +
                            results.rows.item(i).pressure + ", " +
                            results.rows.item(i).temperature + ", " +
                            results.rows.item(i).tDext + ", " +
                            results.rows.item(i).tDmid + ", " +
                            results.rows.item(i).tDint + ", " +
                            results.rows.item(i).sensor_id + ", " +
                            results.rows.item(i).comment + "\n";
                }
                synchTableFile.write(logs, "Translogik iProbe/Inspection Log.txt");
            });
        });
    }
};
