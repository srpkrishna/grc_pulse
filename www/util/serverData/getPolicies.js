define(function (require) {
    var Server = require("./callServer");
    var runTask = function (packId, callback) {
        var sql = "SELECT id,Policy_Name__c,Policy_Description__c FROM Policy__c where Pack__c='" + packId + "' ORDER BY name";
        Server.query(sql, callback);
    };
    return runTask;
});
