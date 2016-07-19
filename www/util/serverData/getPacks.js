define(function (require) {
    var Server = require("./callServer");
    var runTask = function (callback) {
        var sql = "SELECT Id,Name,grcpulse_Pack_Description__c FROM grcpulse_Pack__c ORDER BY Name";
        Server.query(sql, callback);
    };
    return runTask;
});
