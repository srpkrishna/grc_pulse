/**
 * Created by asinha on 18/02/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (surveyId, callback) {
        var sql = "Select Id, Question__c, Survey__c, Type__c, Weightage__c, (Select Id, Name, Is_Correct__c, Score__c, Text__c from Question_Options__r) from Question__c where Survey__c = '" + surveyId + "'";
        Server.query(sql, callback);
    };
    return runTask;
});