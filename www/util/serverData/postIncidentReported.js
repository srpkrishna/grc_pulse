/**
 * Created by asinha on 26/04/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (questions, cbSuccess, cbFailure) {
        var fields = {
            grcpulse_Incident_Description__c: questions[0].answer,
            grcpulse_Incident_Place__c: questions[1].answer,
            grcpulse_Incident_Time__c: questions[2].answer,
            grcpulse_Reported_By__c: window.ms.grcPulse.user.userId
        };
        Server.post("grcpulse_Incident_Reporting__c", fields, cbSuccess, cbFailure);
    };
    return runTask;
});
