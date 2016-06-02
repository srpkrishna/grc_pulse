/**
 * Created by asinha on 25/05/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (registrationId, cbSuccess, cbFailure) {
        var fields = {
            ConnectionToken: registrationId,
            ServiceType: "androidGcm"
        };
        Server.post("MobilePushServiceDevice", fields, cbSuccess, cbFailure);
    };
    return runTask;
});