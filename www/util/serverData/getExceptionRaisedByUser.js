/**
 * Created by asinha on 22/02/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (cbSuccess, cbFailure) {
        var sql = "select grcpulse_Exception__c, grcpulse_Exception_Status__c, grcpulse_Manager__c, grcpulse_BU_Head__c from grcpulse_Requested_Exception__c where grcpulse_Exception_Status__c <> 'Inactive' and grcpulse_Requested_By__c = '" + window.ms.grcPulse.user.userId + "'";
        Server.query(sql, cbSuccess, cbFailure);
    };
    return runTask;
});

/*
    inActive:
 */
