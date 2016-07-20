define(function (require) {
    var Server = require("./callServer");
    var runTask = function (taskId, callback) {
        //var sql = "UPDATE grcpulse__Task__c SET grcpulse__I_ve_Read_All_Related_Document__c=true WHERE grcpulse__User__c='" + window.ms.grcPulse.user.userId + "' AND Id = '" + taskId + "'";
        var fields = {
            grcpulse__Attestation__c: 'Attested'
        };
        Server.update("grcpulse__Task__c", taskId, fields, callback);
    };
    return runTask;
});
