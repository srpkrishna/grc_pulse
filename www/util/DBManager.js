define(function (require) {

    var createTaskTable = 'CREATE TABLE IF NOT EXISTS tasks (' +
        'taskid TEXT PRIMARY KEY,' +
        'taskname TEXT,' +
        'taskdepartment TEXT,' +
        'taskpolicy TEXT' +
        ')';
    var createIncidentReportingTable = "CREATE TABLE IF NOT EXISTS reportedIncidents (incidentDate)";
    var loginDetailsTable = "CREATE TABLE IF NOT EXISTS loginDetailsTable (access_token, id, instance_url, issued_at, refresh_token, scope, signature, token_type)";
    var getOpenDatabase = function () {
        try {
            if (!!window.openDatabase)
                return window.openDatabase;
            else{
                console.log("Not a Supported Browser or SQL Initialisation failed");   
            }
            return undefined;
        }
        catch (e) {
            //console.log("Not a Supported Browser or SQL Initialisation failed");
            return undefined;
        }
    };

    var constructInsertColoumnsAndValues = function (tableName, arrayOfDictionary) {

        //INSERT INTO vehicles (id, vehicle_ref_no, vehicle_plate_no) VALUES (NULL, ?, ?);

        var insertQuery = "INSERT OR IGNORE INTO ";
        insertQuery += tableName + " ";
        //insertQuery += "( ";

        var colNameString = " ( ";
        var colValueString = " ( ";

        var keys = Object.keys(arrayOfDictionary);
        colNameString += keys.join(", ");
        colNameString += " )";

        for (var key in arrayOfDictionary) {
            colValueString += " '" + arrayOfDictionary[key] + "', ";
        }
        var colValue = colValueString.substring(0, colValueString.length - 2);

        colValue += " )";
        insertQuery += colNameString;
        insertQuery += " VALUES ";
        insertQuery += colValue;
        return insertQuery;
    };

    var constructWhereParameters = function (parameters) {
        var parameterArrayLength = Object.keys(parameters).length;
        var whereClause = " ";
        if (parameterArrayLength === 0) {
            return whereClause
        }
        else {
            whereClause = "WHERE ";
        }

        for (var i = 0; i < parameterArrayLength; i++) {
            var eachDict = parameters[i];
            var count = 0;
            for (var key in eachDict) {
                var cName = key;
                var cValue = eachDict[key];
                whereClause += cName + " = " + "'" + cValue + "'";
                count++;
                if (count !== Object.keys(eachDict).length) {
                    whereClause += " AND ";
                }
            }
        }
        return whereClause;
    };

    function onReadyTransaction() {
        //console.log( 'Transaction completed' )
    }

    function onSuccessExecuteSql(tx, results) {
        //console.log( 'Execute SQL completed' )
    }

    function onError(err) {
        //console.log( err.message )
    }

    var db;
    var dbActions = {
        prepareDb: function () {
            var odb = getOpenDatabase();
            if (!odb) {
                return undefined;
            }
            else {
                db = openDatabase('pulseDatabase', '', 'pulseDatabase_Schema', 5 * 1024 * 1024);
                db.transaction(function (t) {
                    t.executeSql(createTaskTable, [], function (t, results) {
                        //console.log(results);
                    }, function (t, error) {
                        //console.log(error.message)
                    });
                    t.executeSql(createIncidentReportingTable, [], function (t, results) {
                        //console.log(results);
                    }, function (t, error) {
                        //console.log(error.message)
                    });
                });
                db.transaction(function (t) {
                    t.executeSql("CREATE TABLE IF NOT EXISTS resources (resourceid TEXT, taskid TEXT,resourcename TEXT, status INTEGER, type TEXT, score NUMBER, PRIMARY KEY(resourceid, taskid))", [], function (t, results) {

                    }, function (t, error) {
                        //console.log(error.message);
                    });
                });
            }
        },
        insertData: function (tableName, coloumnNameAndValues) {
            /*var iQuery = "INSERT INTO tasks  (taskid, taskname, taskdepartment, taskpolicy) VALUES  ( 'a0C61000000RCaVEAW101', 'Breach Management Policy', 'IT', 'a0161000000XLw3AAG')";*/
            if (db) {
                db.transaction(function (tx) {
                    for (var ind = 0; ind < coloumnNameAndValues.length; ind++) {
                        var eachColAndValue = coloumnNameAndValues[ind];
                        var insQuery = constructInsertColoumnsAndValues(tableName, eachColAndValue);
                        tx.executeSql(insQuery, [], function (tx, results) {
                            //console.log(results)
                        }, function (tx, error) {
                            //console.log(error.message);
                        });
                    }
                });
            }
        },
        updateData: function (updateQuery, successCB, failureCB) {
            db.transaction(function (t) {
                t.executeSql(updateQuery, [], function (t, result) {
                    if (successCB) {
                        successCB(result);
                    }
                }, function () {
                    if (failureCB) {
                        failureCB();
                    }
                });
            });
        },
        deleteData: function (tableName, whereParameters, successCB, failureCB) {
            db.transaction(function (t) {
                var deleteQuery = 'DELETE FROM ';
                deleteQuery += tableName + " ";
                if (whereParameters.length > 0) {
                    deleteQuery += constructWhereParameters(whereParameters)
                }
                t.executeSql(deleteQuery, [], function (t, results) {
                    if (successCB) {
                        successCB(results);
                    }
                }, function (t, error) {
                    if (failureCB) {
                        failureCB(error);
                    }
                });

            });
        },
        getDataFromTable: function (tableName, whereParameters, resultCallBack) {
            if (db) {
                db.transaction(function (t) {
                    var readQuery = 'SELECT * FROM ';
                    readQuery += tableName + " ";
                    if (whereParameters.length > 0) {
                        readQuery += constructWhereParameters(whereParameters)
                    }
                    t.executeSql(readQuery, [], function (t, results) {
                        resultCallBack(results.rows);
                    }, function (t, error) {
                    });
                });
            }
        },
        getReportedIncident: function (callback) {
            if (db) {
                db.transaction(function (t) {
                    t.executeSql("SELECT * FROM reportedIncidents", [], function (t, results) {
                        callback(results.rows);
                    }, function (t, error) {
                    });
                });
            }
        },
        insertIncident: function (date, callback) {
            if (db) {
                db.transaction(function (t) {
                    t.executeSql("INSERT INTO reportedIncidents (incidentDate) VALUES (?)", [date], function (t, results) {
                        callback(results.rows);
                    }, function (t, error) {
                    });
                });
            }
        }

    };
    return dbActions;
});