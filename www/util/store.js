define(function (require) {
    var appDispatcher = require("./appDispatcher");
    var constants = require("./constants");
    var dbNew = require("./db");
    var EventEmitter = require("event-emitter").EventEmitter;
    var assign = require("object-assign");
    var et = require("./events");
    var urlStack = [];
    var tasks = [];
    var packs = [];
    var userInfo;
    var userProfileURL;
    var questionnaires = null;
    var questionnaireIndex = -1;
    var exceptionList = [];
    var userExceptions = [];
    var UserCommentForException = {};
    var reportedIncidentList = [];
    var ceoMessage = "";

    appDispatcher.register(function (action) {
        switch (action.actionType) {
            case constants.APP_URL_CHANGED:
            {
                if (action.params.href === -1) {
                    if (urlStack.length == 1) {
                        navigator.app.exitApp();
                    }
                    else {
                        urlStack.pop();
                    }
                }
                else if (action.params.href.indexOf("root") > -1) {
                    for (var i = 0; i < urlStack.length; i++) {
                        var url = urlStack[i];
                        if (url.indexOf("root")) {
                            url = action.params.href;
                            urlStack[i] = url;
                            urlStack.splice(i + 1, urlStack.length - (i + 1));
                            break;
                        }
                    }
                }
                else {
                    urlStack.push(action.params.href)
                }
                questionnaires = null;
                store.emitAppUrlChange();
                break;
            }
            case constants.CHECK_TASK:
            {
                var getTask = require("./serverData/getTask");
                getTask(function (data) {
                    tasks = data.records;
                    var insertResource = function (taskid, type, resources) {
                        for (var j in resources) {
                            var resource = resources[j];
                            var resourceObj = {
                                taskid: taskid,
                                status: 0,
                                resourceid: resource.id,
                                resourcename: resource.name,
                                minscore: resource.minscore,
                                type: type
                            };
                            dbNew.insertTaskResource(resourceObj);
                        }
                    };
                    for (var i in tasks) {
                        var task = tasks[i];
                        var taskObj = {
                            taskid: task.Id,
                            taskname: task.Name,
                            taskdepartment: task.grcpulse_Department__c,
                            taskpolicy: task.grcpulse_Policy__c
                        };
                        dbNew.insertTask(taskObj);
                        var resources = null;
                        var resourceString = task.grcpulse_Resources__c || [];
                        if (resourceString && (typeof resourceString === "string")) {
                            resources = JSON.parse(resourceString);
                            insertResource(taskObj.taskid, "r", resources);
                        }
                        var surveys = null;
                        var surveysString = task.grcpulse_Survey_Details__c || [];
                        if (surveysString && (typeof surveysString === "string")) {
                            surveys = JSON.parse(surveysString);
                            insertResource(taskObj.taskid, "q", surveys);
                        }
                    }
                    var checkURL = store.getAppUrl();
                    if (action.params.emitEvent || checkURL.match(/task/ig)) {
                        store.emitTaskChange();
                    }
                });
                break;
            }
            case constants.ATTESTATION_ACTIVE:
            {
                isActiveAttestation = true;
                store.emitAttestationBtActive();
                break;
            }
            case constants.USER_INFO_FETCH:
            {
                if (!userInfo) {
                    var getUserInfo = require("./serverData/getUserInfo");
                    getUserInfo(null, function (data) {
                        if (data.totalSize === 1) {
                            userInfo = data.records[0];
                            store.emitUserInfoRecieved();
                        }
                        //console.log(data);
                    });
                }
                else {
                    store.emitUserInfoRecieved();
                }
                break;
            }
            case constants.USER_PROFILE_IMAGE:
            {
                if (!userProfileURL) {
                    var getUserProfileImage = require("./serverData/getUserProfileImage");
                    getUserProfileImage(action.params.url, function (data) {
                        saveFile(action.params.fileName, data, function (url) {
                            userProfileURL = url;
                            store.emitUserProfileImageRecieved();
                        });
                    });
                }
                else {
                    store.emitUserProfileImageRecieved();
                }
                break;
            }
            case constants.TASK_IS_COMPLETE:
            {
                if (action.params.taskId) {
                    var updateTaskIsCompleted = require("./serverData/updateTaskIsCompleted");
                    updateTaskIsCompleted(action.params.taskId, function () {
                        store.emitTaskIsCompleted();
                    });
                }
                break;
            }
            case constants.TASK_IS_COMPLETE_UPDATE_DB:
            {
                dbNew.deleteTaskByTaskId(action.params.taskId, function () {
                    dbNew.deleteResourceByTaskId(action.params.taskId, function () {
                        store.emitTaskCompeteDBUpdated();
                    });
                });
                break;
            }
            case constants.GET_QUESTIONNAIRES:
            {
                var getQuestionnaires = require("./serverData/getSurvey");
                getQuestionnaires(action.params.questionnaireId, function(data) {
                    questionnaires = data;
                    questionnaireIndex = -1;
                    store.emitQuestionnairesFetched();
                });
                //questionnaires = require("app/questionnaires/sampleQuestionnaires");
                break;
            }
            case constants.DISPLAY_QUESTIONNAIRE:
            {
                questionnaireIndex = action.params.questionIndex;
                store.emitDisplayQuestionnaire();
                break;
            }
            case constants.DISPLAY_SCORE_CALCULATION:
            {
                store.emitDisplayScoreCalculation();
                break;
            }
            case constants.GET_EXCEPTION_LIST:
            {
                var getExceptionList = require ("./serverData/getExceptionList");
                getExceptionList (function (data) {
                    exceptionList = data.records;
                    var getExceptionsRequestedByUser = require("./serverData/getExceptionRaisedByUser");
                    getExceptionsRequestedByUser (function (data) {
                        userExceptions = data.records;
                        store.emitExceptionListAvailable();
                    }, function () {
                        //console.error("Error retrieving user exception");
                        store.emitExceptionListAvailable();
                    });
                });
                break;
            }
            case constants.REQUEST_EXCEPTION:
            {
                var requestException = require("./serverData/requestException");
                requestException(action.params, function (data) {
                    userExceptions.push({
                        grcpulse_BU_Head__c: null,
                        grcpulse_Exception_Status__c: "Approval Pending",
                        grcpulse_Exception__c: action.params.exceptionId,
                        grcpulse_Manager__c: ""
                    });
                    data.expId = action.params.exceptionId;
                    store.emitExceptionRequestSend(data);
                });
                break;
            }
            case constants.APPROVE_DISAPPROVE_EXCEPTION:
            {
                var approveDisapproveException = require ("./serverData/approveDisapproveException");
                approveDisapproveException(action.params, function (data){
                    store.emitApproveDisapproveException();
                });
                break;
            }
            case constants.GET_REPORTED_INCIDENT:
            {
                dbNew.getReportedIncident(function (response) {
                    reportedIncidentList = [];
                    for (var i = 0; i < response.length; i++) {
                        reportedIncidentList.push(response.item(i).incidentDate);
                    }
                    //console.log("GET_REPORTED_INCIDENT");
                   store.emitReportedIncidentListAvailable();
                });
                break;
            }
            case constants.SEND_INCIDENT_REPORTED:
            {
                var postIncident = require("./serverData/postIncidentReported");
                /*var dateWithOutOffSet = new Date(action.params.questions[2].answer);
                var millisecondsPassed = dateWithOutOffSet.getTime() + dateWithOutOffSet.getTimezoneOffset() * 60 * 1000;
                action.params.questions[2].answer = new Date(millisecondsPassed);*/
                var splitValue = action.params.questions[2].answer.split("T");
                var dateSplit = splitValue[0].split("-");
                var timeSplit = splitValue[1].split(":");
                action.params.questions[2].answer = new Date(dateSplit[0], dateSplit[1] -1, dateSplit[2], timeSplit[0] -1, timeSplit[1], 0);
                postIncident (action.params.questions, function (data) {
                    if (data.success) {
                        var date = action.params.questions[2].answer;
                        dbNew.insertIncident(date.getTime(), function (rowsEffected) {
                            store.emitIncidentReported();
                        });
                    }
                    //console.log(data);
                });
                break;
            }
            case constants.REGISTER_DEVICE_REGISTRATION_ID:
            {
                var postDeviceRegistrationId = require("./serverData/postDeviceRegistrationId");
                postDeviceRegistrationId(action.params.registrationId, function (a) {
                    console.log(a);
                }, function (b) {
                    console.log(b);
                });
                break;
            }
            case constants.GET_EXCEPTION_COMMENT:
            {
                var getExceptionComment = require("./serverData/getExceptionComment");
                getExceptionComment(action.params.requestedExceptionId, function (data) {
                    var comment = data.records && data.records.length ? data.records[0].grcpulse_Comment__c : "No reason provided";
                    var status = data.records && data.records.length ? data.records[0].grcpulse_Exception_Approver_Level__c : "NA";
                    store.getTaskDetails(action.params.taskId).grcpulse_Comment__c = comment;
                    store.getTaskDetails(action.params.taskId).grcpulse_Exception_Approver_Level__c = status;
                    store.emitExceptionCommentAvailable();
                });
                break;
            }
            case constants.LOGOUT:
            {
                dbNew.getLoginInfo("refresh_token", function (refresh_token) {
                    var logout = require("./serverData/logout");
                    refresh_token = sjcl.decrypt(device.uuid, JSON.parse(refresh_token));
                    logout(refresh_token, function (data) {
                        dbNew.deleteLoginInfo(function () {
                            window.location = "file:///android_asset/www/index.html";
                        }, function () {

                        });
                    }, function () {

                    });
                });
                break;
            }
            case constants.SEND_CEO_MESSAGE:
            {
                var postCEOMessage = require("./serverData/postCEOMessage");
                postCEOMessage(ceoMessage, function (data) {
                    ceoMessage = "";
                    store.emitCEOMessageSend();
                }, function () {

                });
                break;
            }
            case constants.GET_CEO_MESSAGE_USER_PROFILE:
            {
                var getUserInfo = require("./serverData/getUserInfo");
                getUserInfo(action.params.creatorId, function (data) {
                    if (data.totalSize === 1) {
                        store.getTaskDetails(action.params.taskId).userInfo = data.records[0];
                        store.emitUserInfoRecieved();
                    }
                });
                break;
            }
            case constants.GET_CEO_MESSAGE_USER_IMAGE:
            {
                var getUserProfileImage = require("./serverData/getUserProfileImage");
                getUserProfileImage(action.params.url, function (data) {
                    saveFile(action.params.fileName, data, function (url) {
                        store.getTaskDetails(action.params.taskId).userProfileImageURL = url;
                        store.emitUserProfileImageRecieved();
                    });
                });
            }
            case constants.SAVE_LOGIN_INFO:
            {
                dbNew.saveLoginInfo(action.params.info);
                break;
            }
            case constants.UPDATE_LOGIN_INFO:
            {
                dbNew.updateLoginInfo(action.params.info);
                break;
            }
            default:
            {
                //console.error("No Registered action");
            }
        }
    });

    var store = assign({}, EventEmitter.prototype, {
        getAppUrl: function () {
            return urlStack[urlStack.length - 1];
        },
        pushAppUrl: function (url) {
            urlStack.push(url);
        },
        popAppUrl: function () {
            urlStack.pop();
        },
        getParameterByName: function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(urlStack[urlStack.length - 1]);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        emitAppUrlChange: function () {
            this.emit(et.APP_URL_CHANGE);
        },
        addAppUrlChangeListener: function (callback) {
            this.on(et.APP_URL_CHANGE, callback);
        },
        removeAppUrlChangeListener: function (callback) {
            this.removeListener(et.APP_URL_CHANGE, callback);
        },
        getTasks: function () {
            return tasks;
        },
        getPacks: function () {
            return packs;
        },
        setPacks: function (data) {
            packs = data;
        },
        getResource: function (note, callback) {
            var error = function (error) {
                alert(error);
            };
            var resource = require("./serverData/getResource");
            if (!note.Body) {
                resource.getFromSalesForce(note.Id,
                    function (data) {
                        if (data) {
                            saveFileInDir(note.Id, note.Title, data, callback);
                        }
                        else {
                            error(getString("error_download"));
                        }
                    },
                    error
                );
            }
            else {
                resource.getFromAWS(note, callback, error)
            }
        },
        emitTaskChange: function () {
            this.emit(et.TASK_CHANGE);
        },
        addTaskChangeListener: function (callback) {
            this.on(et.TASK_CHANGE, callback);
        },
        removeTaskChangeListener: function (callback) {
            this.removeListener(et.TASK_CHANGE, callback);
        },
        getTaskDetails: function (id) {
            var data = {};
            for (var i = 0; i < tasks.length; i++) {
                if (id === tasks[i].Id) {
                    data = tasks[i];
                    break;
                }
            }
            return data;
        },
        getPackDetails: function (id) {
            var data = {};
            for (var i = 0; i < packs.length; i++) {
                if (id === packs[i].id) {
                    data = packs[i];
                    break;
                }
            }
            return data;
        },
        getTaskCount: function () {
            return tasks.length;
        },
        getUserInfo: function () {
            return userInfo;
        },
        emitUserInfoRecieved: function () {
            this.emit(et.USER_INFO_FETCH);
        },
        addUserInfoFetchListener: function (callback) {
            this.on(et.USER_INFO_FETCH, callback);
        },
        removeUserInfoFetchListener: function (callback) {
            this.removeListener(et.USER_INFO_FETCH, callback);
        },
        getUserProfileUrl: function () {
            return userProfileURL;
        },
        emitUserProfileImageRecieved: function () {
            this.emit(et.USER_PROFILE_IMAGE_FETCH);
        },
        addUserProfileImageListener: function (callback) {
            this.on(et.USER_PROFILE_IMAGE_FETCH, callback);
        },
        removeUserProfileImageListener: function (callback) {
            this.removeListener(et.USER_PROFILE_IMAGE_FETCH, callback);
        },
        emitTaskIsCompleted: function () {
            this.emit(et.TASK_IS_COMPLETE);
        },
        addTaskIsCompletedListener: function (callback) {
            this.on(et.TASK_IS_COMPLETE, callback);
        },
        removeTaskIsCompletedListener: function (callback) {
            this.removeListener(et.TASK_IS_COMPLETE, callback);
        },
        getNewDB: function () {
            return dbNew;
        },
        emitTaskCompeteDBUpdated: function () {
            this.emit(et.TASK_IS_COMPLETE_DB_UPDATED);
        },
        addTaskIsCompletedDBUpdatedListener: function (callback) {
            this.on(et.TASK_IS_COMPLETE_DB_UPDATED, callback);
        },
        removeTaskIsCompletedDBUpdatedListener: function (callback) {
            this.removeListener(et.TASK_IS_COMPLETE_DB_UPDATED, callback);
        },
        getQuestionnaires: function () {
            return questionnaires;
        },
        emitQuestionnairesFetched: function () {
            this.emit(et.QUESTION_FETCHED);
        },
        addQuestionnairesFetchedListener: function (callback) {
            this.on(et.QUESTION_FETCHED, callback);
        },
        removeQuestionnairesFetchedListener: function (callback) {
            this.removeListener(et.QUESTION_FETCHED, callback);
        },
        getQuestionnaireAnswer: function (index) {
            return questionnaires.records[index].userAnswer;
        },
        setQuestionnaireAnswer: function (qIndex, aIndex) {
            if (questionnaires) {
                questionnaires.records[qIndex].userAnswer = aIndex;
            }
        },
        getDisplayQuestionnaireIndex: function () {
            return questionnaireIndex;
        },
        emitDisplayQuestionnaire: function () {
            this.emit(et.DISPLAY_QUESTIONNAIRE);
        },
        addDisplayQuestionnaireListener: function (callback) {
            this.on(et.DISPLAY_QUESTIONNAIRE, callback);
        },
        removeDisplayQuestionnaireListener: function (callback) {
            this.removeListener(et.DISPLAY_QUESTIONNAIRE, callback);
        },
        emitDisplayScoreCalculation: function () {
            this.emit(et.DISPLAY_SCORE_CALCULATION);
        },
        addDisplayScoreCalculationListener: function (callback) {
            this.on(et.DISPLAY_SCORE_CALCULATION, callback);
        },
        removeDisplayScoreCalculationListener: function (callback) {
            this.removeListener(et.DISPLAY_SCORE_CALCULATION, callback);
        },
        getExceptionList: function () {
            return exceptionList;
        },
        emitExceptionListAvailable: function () {
            this.emit(et.EXCEPTION_LIST_AVAILABLE);
        },
        addExceptionListAvailableListener: function (callback) {
            this.on(et.EXCEPTION_LIST_AVAILABLE, callback);
        },
        removeExceptionListAvailableListener: function (callback) {
            this.removeListener(et.EXCEPTION_LIST_AVAILABLE, callback);
        },
        isThisUserExceptionActive: function (exceptionId) {
            var flag = {isActive: true, status: ""};
            for (var i = 0; i < userExceptions.length; i++) {
                if ((exceptionId === userExceptions[i].grcpulse_Exception__c) && ("inActive" !== userExceptions[i].grcpulse_Exception_Status__c)) {
                    flag.isActive = false;
                    flag.status = userExceptions[i].grcpulse_Exception_Status__c;
                    break;
                }
            }
            return flag;
        },
        getUserCommentForException: function (exceptionId) {
            return UserCommentForException[exceptionId];
        },
        setUserCommentForException: function (exceptionId, comment) {
            UserCommentForException[exceptionId] = comment;
        },
        emitExceptionRequestSend: function (data) {
            this.emit(et.EXCEPTION_REQUEST_SEND, data);
        },
        addExceptionRequestSendListener: function (callback) {
            this.on(et.EXCEPTION_REQUEST_SEND, callback);
        },
        removeExceptionRequestSendListener: function (callback) {
            this.removeListener(et.EXCEPTION_REQUEST_SEND, callback);
        },
        emitApproveDisapproveException: function () {
            this.emit(et.APPROVE_DISAPPROVE_EXCEPTION);
        },
        addApproveDisapproveExceptionListener: function (callback) {
            this.on(et.APPROVE_DISAPPROVE_EXCEPTION, callback);
        },
        removeApproveDisapproveExceptionListener: function (callback) {
            this.removeListener(et.APPROVE_DISAPPROVE_EXCEPTION, callback);
        },
        getReportedIncidentList: function () {
            return reportedIncidentList;
        },
        emitReportedIncidentListAvailable: function () {
            this.emit(et.INCIDENT_REPORTED_LIST);
        },
        addReportedIncidentListAvailableListener: function (callback) {
            this.on(et.INCIDENT_REPORTED_LIST, callback);
        },
        removeReportedIncidentListAvailableListener: function (callback) {
            this.removeListener(et.INCIDENT_REPORTED_LIST, callback);
        },
        emitIncidentReported: function () {
            this.emit(et.INCIDENT_REPORTED);
        },
        addIncidentReportedListener: function (callback) {
            this.on(et.INCIDENT_REPORTED, callback);
        },
        removeIncidentReportedListener: function (callback) {
            this.removeListener(et.INCIDENT_REPORTED, callback);
        },
        emitExceptionCommentAvailable: function () {
            this.emit(et.EXCEPTION_COMMENT_AVAILABLE);
        },
        addExceptionCommentAvailableListener: function (callback) {
            this.on(et.EXCEPTION_COMMENT_AVAILABLE, callback);
        },
        removeExceptionCommentAvailableListener: function (callback) {
            this.removeListener(et.EXCEPTION_COMMENT_AVAILABLE, callback);
        },
        getMessage: function () {
            return ceoMessage;
        },
        setMessage: function (message) {
            ceoMessage = message;
        },
        emitCEOMessageSend: function () {
            this.emit(et.CEO_MESSAGE_SEND);
        },
        addCEOMessageSendListener: function (callback) {
            this.on(et.CEO_MESSAGE_SEND, callback);
        },
        removeCEOMessageSendListener: function (callback) {
            this.removeListener(et.CEO_MESSAGE_SEND, callback);
        }
    });
    return store;
});

function saveFile(fileName, data, callback) {
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {
        dir.getFile(fileName, {create: true}, function (file) {
            file.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (evt) {
                    callback(file.nativeURL);
                };
                var blob = new Blob([data.content], {type: data.contentType});
                fileWriter.write(blob);

            }, function (error) {
                alert(error.code);
            });
        });
    });
}

function saveFileInDir(dirName, fileName, data, callback) {
    $("#loading").removeClass("hide");
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, gotFS, fail);
    function fail(error) {
        $("#loading").addClass("hide");
        alert(error.code);
    }

    function gotFS(fileSystem) {
        fileSystem.getDirectory(dirName, {create: true}, gotDir, fail);
    }

    function gotDir(dirEntry) {
        dirEntry.getFile(fileName, {create: true, exclusive: true}, gotFile, fail);
    }
    function gotFile(file) {
        file.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function (evt) {
                $("#loading").addClass("hide");
                callback();
            };
            var blob = new Blob([data.content], {type: data.contentType});
            fileWriter.write(blob);

        }, fail);
    }
}
