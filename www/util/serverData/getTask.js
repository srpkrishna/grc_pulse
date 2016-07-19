define(function (require) {
    var Server = require("./callServer");
    var runTask = function (callback) {
        var sql = "SELECT id, name, grcpulse__Summary__c, grcpulse__Type__c, grcpulse__Department__c, grcpulse__Resources__c, grcpulse__End_Date__c, grcpulse__Policy__c, grcpulse__Survey_Details__c, grcpulse__Requested_Exception__c, CreatedById, grcpulse__Activity_Task__c FROM grcpulse__Task__c WHERE grcpulse__Archived__c = false AND grcpulse__User__c='" + window.ms.grcPulse.user.userId + "' ORDER BY CreatedDate";
        Server.query(sql, callback);
    };
    return runTask;
});
