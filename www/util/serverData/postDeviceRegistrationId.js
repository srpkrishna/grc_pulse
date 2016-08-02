/**
 * Created by asinha on 25/05/16.
 */
define(function (require) {
    var Server = require("./callServer");
    var runTask = function (registrationId, cbSuccess, cbFailure) {
        var serviceType = "Apple";
        if(device.platform === "Android"){
            serviceType = "androidGcm";
        }
        var fields = {
            ConnectionToken: registrationId,
            ServiceType: serviceType
        };
        console.log(registrationId);
        Server.post("MobilePushServiceDevice", fields, cbSuccess, cbFailure);
    };
    return runTask;
});
