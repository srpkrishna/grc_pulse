define(function (require) {
    var Server = require("./callServer");
    var runTask = function (callback) {
        var sql = "SELECT id, name, Summary__c, Type__c, Department__c, Resources__c, End_Date__c, Policy__c, Survey_Details__c, Requested_Exception__c, CreatedById, Activity_Task__c FROM Task__c WHERE Archived__c = false AND User__c='" + window.ms.grcPulse.user.userId + "' ORDER BY CreatedDate";
        Server.query(sql, callback);
    };
    return runTask;
});
