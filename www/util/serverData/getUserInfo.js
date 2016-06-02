define(function (require) {
    var Server = require("./callServer");
    var runTask = function (userId, callback) {
        var sql = "SELECT Username, Title, FirstName, LastName, Name, CompanyName, Division, Department, Email, FullPhotoUrl, SmallPhotoUrl, CanSendPublicMessage__c FROM User WHERE Id='" + (userId ? userId : window.ms.grcPulse.user.userId) + "'";
        Server.query(sql, callback);
    };
    return runTask;
});