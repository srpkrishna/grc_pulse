/**
 * Created by asinha on 09/06/16.
 */
define(function(require) {
    //var db = window.sqlitePlugin.openDatabase({name: "GRCPulseDatabase.db", location: "default"});
    var db = window.openDatabase("GRCPulseDatabase", "1.0", "GRCPulseDatabase Database", 5 * 1024 * 1024);
    db.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS tasks (taskid TEXT PRIMARY KEY, taskname TEXT, taskdepartment TEXT, taskpolicy TEXT)", [], function (t, results) {

        }, function (t, error) {

        });
        t.executeSql("CREATE TABLE IF NOT EXISTS resources (resourceid TEXT, taskid TEXT, resourcename TEXT, status INTEGER, type TEXT, minscore NUMBER, PRIMARY KEY(resourceid, taskid))", [], function (t, results) {

        }, function (t, error) {

        });
        t.executeSql("CREATE TABLE IF NOT EXISTS reportedIncidents (incidentDate)", [], function () {

        }, function (err) {

        });
        t.executeSql("CREATE TABLE IF NOT EXISTS loginDetailsTable (access_token, id, instance_url, issued_at, refresh_token, scope, signature, token_type)", [], function () {

        }, function (err) {

        });
    });

    var runDBTask = {
        insertTask: function (task, callbackSuccess, callbackFailure) {
            db.transaction(function (t) {
                t.executeSql("INSERT INTO tasks (taskid, taskname, taskdepartment, taskpolicy) VALUES (?,?,?,?)", [
                    task.taskid, task.taskname, task.taskdepartment, task.taskpolicy
                ], function () {
                    if(callbackSuccess) {
                        callbackSuccess();
                    }
                }, function () {
                    if(callbackFailure) {
                        callbackFailure();
                    }
                });
            });
        },
        insertTaskResource: function (resource, callbackSuccess, callbackFailure) {
            db.transaction(function (t) {
                t.executeSql("INSERT INTO resources (resourceid, taskid, resourcename, status, type, minscore) VALUES (?,?,?,?,?,?)", [
                    resource.resourceid, resource.taskid, resource.resourcename, resource.status, resource.type, resource.minscore
                ], function () {
                    if(callbackSuccess) {
                        callbackSuccess();
                    }
                }, function () {
                    if(callbackFailure) {
                        callbackFailure();
                    }
                });
            });
        },
        updateResourceStatus: function (resourceId, taskId, callbackSuccess, callbackFailure) {
            db.transaction(function (t) {
                t.executeSql("UPDATE resources SET status=1 WHERE resourceid=? AND taskid=?", [resourceId, taskId], function () {
                    if(callbackSuccess) {
                        callbackSuccess();
                    }
                }, function () {
                    if(callbackFailure) {
                        callbackFailure();
                    }
                });
            });
        },
        deleteTaskByTaskId: function (taskId, callbackSuccess, callbackFailure) {
            db.transaction(function (t) {
                t.executeSql("DELETE FROM tasks WHERE taskid=?", [taskId], function () {
                    if(callbackSuccess) {
                        callbackSuccess();
                    }
                }, function () {
                    if(callbackFailure) {
                        callbackFailure();
                    }
                });
            });
        },
        deleteResourceByTaskId: function (taskId, callbackSuccess, callbackFailure) {
            db.transaction(function (t) {
                t.executeSql("DELETE FROM resources WHERE taskid=?", [taskId], function () {
                    if(callbackSuccess) {
                        callbackSuccess();
                    }
                }, function () {
                    if(callbackFailure) {
                        callbackFailure();
                    }
                });
            });
        },
        getTaskList: function (callbackSuccess, callbackFailure) {
            db.transaction(function (t) {
                t.executeSql("SELECT * FROM tasks", [], function (t, results) {
                    if(callbackSuccess) {
                        callbackSuccess(results.rows);
                    }
                }, function (t, error) {
                    if(callbackFailure) {
                        callbackFailure();
                    }
                });
            });
        },
        getResourcesByTaskId: function (taskId, callbackSuccess, callbackFailure) {
            db.transaction(function (t) {
                t.executeSql("SELECT * FROM resources WHERE taskid=?", [taskId], function (t, results) {
                    if(callbackSuccess) {
                        callbackSuccess(results.rows);
                    }
                }, function (t, error) {
                    if(callbackFailure) {
                        callbackFailure();
                    }
                });
            });
        },
        getResourcesByIdAndTaskId: function (resourceid, taskId, callbackSuccess, callbackFailure) {
            db.transaction(function (t) {
                t.executeSql("SELECT * FROM resources WHERE resourceid=? AND taskid=?", [resourceid, taskId], function (t, results) {
                    if(callbackSuccess) {
                        callbackSuccess(results.rows);
                    }
                }, function (t, error) {
                    if(callbackFailure) {
                        callbackFailure();
                    }
                });
            });
        },
        getReportedIncident: function (callbackSuccess, callbackFailure) {
            db.transaction(function (t) {
                t.executeSql("SELECT * FROM reportedIncidents", [], function (t, results) {
                    if(callbackSuccess) {
                        callbackSuccess(results.rows);
                    }
                }, function (t, error) {
                    if(callbackFailure) {
                        callbackFailure();
                    }
                });
            });
        },
        insertIncident: function (date, callbackSuccess, callbackFailure) {
            db.transaction(function (t) {
                t.executeSql("INSERT INTO reportedIncidents (incidentDate) VALUES (?)", [date], function (t, results) {
                    if(callbackSuccess) {
                        callbackSuccess(results.rows);
                    }
                }, function (t, error) {
                    if(callbackFailure) {
                        callbackFailure();
                    }
                });
            });
        }
    };

    return runDBTask;
});