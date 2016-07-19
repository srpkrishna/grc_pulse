/**
 * Created by asinha on 22/02/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (cbSuccess, cbFailure) {
        var sql = "select grcpulse__Exception__c, grcpulse__Exception_Status__c, grcpulse__Manager__c, grcpulse__BU_Head__c from grcpulse__Requested_Exception__c where grcpulse__Exception_Status__c <> 'Inactive' and grcpulse__Requested_By__c = '" + window.ms.grcPulse.user.userId + "'";
        Server.query(sql, cbSuccess, cbFailure);
    };
    return runTask;
});

/*
    inActive:
 */
