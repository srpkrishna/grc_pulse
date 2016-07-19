define(function (require) {
    var Server = require("./callServer");
    var runTask = function (callback) {
        var sql = "SELECT Id,Name,grcpulse__Pack_Description__c FROM grcpulse__Pack__c ORDER BY Name";
        Server.query(sql, callback);
    };
    return runTask;
});
