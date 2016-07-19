define(function (require) {
    var Server = require("./callServer");
    var runTask = function (taskId, callback) {
        //var sql = "UPDATE grcpulse_Task__c SET grcpulse_I_ve_Read_All_Related_Document__c=true WHERE grcpulse_User__c='" + window.ms.grcPulse.user.userId + "' AND Id = '" + taskId + "'";
        var fields = {
            grcpulse_Attestation__c: 'Attested'
        };
        Server.update("grcpulse_Task__c", taskId, fields, callback);
    };
    return runTask;
});
