/**
 * Created by asinha on 22/02/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (data, callback) {
        var fields = {
            Comment__c: data.comment,
            Requested_By__c: window.ms.grcPulse.user.userId,
            Exception__c: data.exceptionId
        };
        Server.insert("Requested_Exception__c", fields, callback);
    };
    return runTask;
});