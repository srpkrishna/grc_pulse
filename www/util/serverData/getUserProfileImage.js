define(function (require) {
    var Server = require("./callServer");
    var runTask = function (url, callback) {
        Server.restCustomURL(url, callback);
    };
    return runTask;
});