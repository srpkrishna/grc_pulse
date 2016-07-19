define(function (require) {
    var Server = require("./callServer");
    var runTask = function (packId, callback) {
        var sql = "SELECT id, Name, grcpulse_Policy_Description__c FROM grcpulse_Policy__c where grcpulse_Pack__c='" + packId + "' ORDER BY name";
        Server.query(sql, callback);
    };
    return runTask;
});
