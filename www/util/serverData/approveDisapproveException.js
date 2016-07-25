/**
 * Created by asinha on 25/02/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (params, callback) {
        var fields = {
            grcpulse__Exception_Status__c: params.type
        };
        Server.update("grcpulse__Task__c", params.taskId, fields, callback);
    };
    return runTask;
});
