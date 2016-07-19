/**
 * Created by asinha on 22/02/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (data, callback) {
        var fields = {
            grcpulse__Comment__c: data.comment,
            grcpulse__Requested_By__c: window.ms.grcPulse.user.userId,
            grcpulse__Exception__c: data.exceptionId
        };
        Server.insert("grcpulse__Requested_Exception__c", fields, callback);
    };
    return runTask;
});
