define(function (require) {
    var Server = require("./callServer");
    var runTask = function (callback) {
        var sql = "SELECT id, name, grcpulse_Summary__c, grcpulse_Type__c, grcpulse_Department__c, grcpulse_Resources__c, grcpulse_End_Date__c, grcpulse_Policy__c, grcpulse_Survey_Details__c, grcpulse_Requested_Exception__c, CreatedById, grcpulse_Activity_Task__c FROM grcpulse_Task__c WHERE grcpulse_Archived__c = false AND grcpulse_User__c='" + window.ms.grcPulse.user.userId + "' ORDER BY CreatedDate";
        Server.query(sql, callback);
    };
    return runTask;
});
