/**
 * Created by asinha on 26/04/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (questions, cbSuccess, cbFailure) {
        var fields = {
            Incident_Description__c: questions[0].answer,
            Incident_Place__c: questions[1].answer,
            Incident_Time__c: questions[2].answer,
            Reported_By__c: window.ms.grcPulse.user.userId
        };
        Server.post("Incident_Reporting__c", fields, cbSuccess, cbFailure);
    };
    return runTask;
});