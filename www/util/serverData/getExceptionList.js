define(function (require) {
    var Server = require("./callServer");
    var runTask = function (callback) {
        var sql = "SELECT id, name, grcpulse_Concurrent_Request_Allowed__c, grcpulse_Policy__r.name, grcpulse_Policy__r.Pack__r.Name, grcpulse_IT_Team_Name__c FROM grcpulse_Exception__c";
        //var sql = "SELECT id, name, Policy__r.name, Policy__r.Pack__r.Name FROM Exception__c";
        Server.query(sql, callback);
    };
    return runTask;
});
