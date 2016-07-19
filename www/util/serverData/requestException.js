/**
 * Created by asinha on 22/02/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (data, callback) {
        var fields = {
            grcpulse_Comment__c: data.comment,
            grcpulse_Requested_By__c: window.ms.grcPulse.user.userId,
            grcpulse_Exception__c: data.exceptionId
        };
        Server.insert("grcpulse_Requested_Exception__c", fields, callback);
    };
    return runTask;
});
