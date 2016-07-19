/**
 * Created by asinha on 18/02/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (surveyId, callback) {
        var sql = "Select Id, grcpulse_Question__c, grcpulse_Survey__c, grcpulse_Type__c, grcpulse_Weightage__c, (Select Id, Name, grcpulse_Is_Correct__c, grcpulse_Score__c, grcpulse_Text__c from Question_Options__r) from grcpulse_Question__c where grcpulse_Survey__c = '" + surveyId + "'";
        Server.query(sql, callback);
    };
    return runTask;
});
