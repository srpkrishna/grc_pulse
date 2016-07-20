/**
 * Created by asinha on 26/05/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (message, cbSuccess, cbFailure) {
        var fields = {
            Name: "Drip Message",
            grcpulse__Message__c: message
        };
        Server.post("grcpulse__Public_Message__c", fields, cbSuccess, cbFailure);
    };
    return runTask;
});
