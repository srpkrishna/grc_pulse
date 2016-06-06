/**
 * Created by asinha on 25/05/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (id, callback) {
        var sql = "SELECT Comment__c, Exception_Approver_Level__c FROM Requested_Exception__c WHERE id = '" + id + "'";
        Server.query(sql, callback);
    };
    return runTask;
});