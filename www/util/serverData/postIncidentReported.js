/**
 * Created by asinha on 26/04/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (questions, cbSuccess, cbFailure) {
        var fields = {
            grcpulse__Incident_Description__c: questions[0].answer,
            grcpulse__Incident_Place__c: questions[1].answer,
            grcpulse__Incident_Time__c: questions[2].answer,
            grcpulse__Reported_By__c: window.ms.grcPulse.user.userId
        };
        Server.post("grcpulse__Incident_Reporting__c", fields, cbSuccess, cbFailure);
    };
    return runTask;
});
