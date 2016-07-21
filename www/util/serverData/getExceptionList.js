define(function (require) {
    var Server = require("./callServer");
    var runTask = function (callback) {
        var sql = "SELECT id, name, grcpulse__Concurrent_Request_Allowed__c, grcpulse__Policy__r.name, grcpulse__Policy__r.grcpulse__Pack__r.Name, grcpulse__IT_Team_Name__c FROM grcpulse__Exception__c";
        //var sql = "SELECT id, name, Policy__r.name, Policy__r.Pack__r.Name FROM Exception__c";
        Server.query(sql, callback);
    };
    return runTask;
});
