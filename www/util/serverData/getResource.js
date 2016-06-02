define(function (require) {
    var Server = require("./callServer");
    var getFromSalesForce = function (resourceId, callback, error) {
        var url = "/sobjects/Attachment/" + resourceId + "/Body";
        Server.rest(url, callback, error);
    };

    var getFromAWS = function (note, callback, error) {
        Server.downloadAWSFile(note, callback, error);
    };

    var resource = {
        getFromSalesForce: getFromSalesForce,
        getFromAWS: getFromAWS
    }

    return resource;
});
