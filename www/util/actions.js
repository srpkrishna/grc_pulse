define(function (require) {
    var appDispatcher = require("./appDispatcher");
    var constants = require("./constants");
    var actions = {
        changeUrl: function (params) {
            if (history && params.href && location.pathname !== params.href && params.href !== -1) {
                history.pushState(params, "GRC Pulse - " + params.href, params.href);
            }
            appDispatcher.dispatch({
                actionType: constants.APP_URL_CHANGED,
                params: params
            });
        },
        checkTask: function (params) {
            appDispatcher.dispatch({
                actionType: constants.CHECK_TASK,
                params: params
            });
        },
        getUserInfo: function () {
            appDispatcher.dispatch({
                actionType: constants.USER_INFO_FETCH
            });
        },
        getUserProfileImage: function (params) {
            appDispatcher.dispatch({
                actionType: constants.USER_PROFILE_IMAGE,
                params: params
            });
        },
        taskIsComplete: function (params) {
            appDispatcher.dispatch({
                actionType: constants.TASK_IS_COMPLETE,
                params: params
            });
        },
        updateDBOnTaskComplete: function (params) {
            appDispatcher.dispatch({
                actionType: constants.TASK_IS_COMPLETE_UPDATE_DB,
                params: params
            });
        },
        getQuestionnaires: function (params) {
            appDispatcher.dispatch({
                actionType: constants.GET_QUESTIONNAIRES,
                params: params
            });
        },
        displayQuestionnaire: function (params) {
            appDispatcher.dispatch({
                actionType: constants.DISPLAY_QUESTIONNAIRE,
                params: params
            });
        },
        displayScoreCalculation: function () {
            appDispatcher.dispatch({
                actionType: constants.DISPLAY_SCORE_CALCULATION
            });
        },
        getExceptionList: function () {
            appDispatcher.dispatch({
                actionType: constants.GET_EXCEPTION_LIST
            });
        },
        requestException: function (params) {
            appDispatcher.dispatch({
                actionType: constants.REQUEST_EXCEPTION,
                params: params
            });
        },
        sendApproveDisapproveException: function (params) {
            appDispatcher.dispatch({
                actionType: constants.APPROVE_DISAPPROVE_EXCEPTION,
                params: params
            });
        },
        getReportedIncidentFromDB: function () {
            appDispatcher.dispatch({
                actionType: constants.GET_REPORTED_INCIDENT
            });
        },
        sendIncidentReported: function (params) {
            appDispatcher.dispatch({
                actionType: constants.SEND_INCIDENT_REPORTED,
                params: params
            });
        },
        saveRegistrationIdOfNotification: function (params) {
            appDispatcher.dispatch({
                actionType: constants.REGISTER_DEVICE_REGISTRATION_ID,
                params: params
            });
        },
        getExceptionComments: function (params) {
            appDispatcher.dispatch({
                actionType: constants.GET_EXCEPTION_COMMENT,
                params: params
            });
        },
        logout: function () {
            appDispatcher.dispatch({
                actionType: constants.LOGOUT
            });
        },
        sendCEOMessage: function () {
            appDispatcher.dispatch({
                actionType: constants.SEND_CEO_MESSAGE
            });
        },
        getCEOMessageUserProfile: function (params) {
            appDispatcher.dispatch({
                actionType: constants.GET_CEO_MESSAGE_USER_PROFILE,
                params: params
            });
        },
        getCEOMessageUserImage: function (params) {
            appDispatcher.dispatch({
                actionType: constants.GET_CEO_MESSAGE_USER_IMAGE,
                params: params
            });
        }
    };
    return actions;
});
