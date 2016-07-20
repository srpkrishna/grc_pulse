/**
 * Created by asinha on 18/02/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (surveyId, callback) {
        var sql = "Select Id, grcpulse__Question__c, grcpulse__Survey__c, grcpulse__Type__c, grcpulse__Weightage__c, (Select Id, Name, grcpulse__Is_Correct__c, grcpulse__Score__c, grcpulse__Text__c from grcpulse__Question_Options__r) from grcpulse__Question__c where grcpulse__Survey__c = '" + surveyId + "'";
        Server.query(sql, callback);
    };
    return runTask;
});
