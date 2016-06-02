/**
 * Created by asinha on 22/02/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (cbSuccess, cbFailure) {
        var sql = "select Exception__c, Exception_Status__c, Manager__c, BU_Head__c from Requested_Exception__c where Exception_Status__c <> 'Inactive' and Requested_By__c = '" + window.ms.grcPulse.user.userId + "'";
        Server.query(sql, cbSuccess, cbFailure);
    };
    return runTask;
});

/*
    inActive:
 */