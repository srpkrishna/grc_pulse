define(function (require) {
    var Server = require("./callServer");
    var runTask = function (callback) {
        var sql = "SELECT id, name, Concurrent_Request_Allowed__c, Policy__r.name, Policy__r.Pack__r.Name, IT_Team_Name__c FROM Exception__c";
        //var sql = "SELECT id, name, Policy__r.name, Policy__r.Pack__r.Name FROM Exception__c";
        Server.query(sql, callback);
    };
    return runTask;
});