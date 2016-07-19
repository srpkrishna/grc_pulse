define(function (require) {
    var Server = require("./callServer");
    var runTask = function (packId, callback) {
        var sql = "SELECT id, Name, grcpulse__Policy_Description__c FROM grcpulse__Policy__c where grcpulse__Pack__c='" + packId + "' ORDER BY name";
        Server.query(sql, callback);
    };
    return runTask;
});
