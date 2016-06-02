define(function (require) {
    var Server = require("./callServer");
    var runTask = function (taskId, callback) {
        //var sql = "UPDATE Task__c SET I_ve_Read_All_Related_Document__c=true WHERE User__c='" + window.ms.grcPulse.user.userId + "' AND Id = '" + taskId + "'";
        var fields = {
            Attestation__c: 'Attested'
        };
        Server.update("Task__c", taskId, fields, callback);
    };
    return runTask;
});