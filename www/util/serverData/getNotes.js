define(function (require) {
    var Server = require("./callServer");
    var runTaskWithPolicyId = function (policyId, callback, error) {
        var sql = "SELECT Id,Title,Body FROM Note where ParentId='" + policyId + "' ORDER BY Title";
        Server.query(sql, callback, error);
    };

    var runTaskWithId = function (Id, callback, error) {
        var sql = "SELECT Id, Title, Body FROM Note where Id='" + Id + "'";
        Server.query(sql, callback, error);
    };

    var notes = {
        getNotesFromPolicyId: runTaskWithPolicyId,
        getNoteFromId: runTaskWithId
    };
    return notes;
});
