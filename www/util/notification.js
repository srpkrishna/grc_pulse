/**
 * Created by asinha on 25/05/16.
 */
define(function (require) {
    var actions = require("./actions");
    var pushNotification = PushNotification.init({
        android: {
            senderID: "343201725359",
            vibrate: true,
            sound: true,
            iconColor: "#4804AB"
        },
        ios: {
            alert: "true",
            badge: true,
            sound: 'false'
        },
        windows: {}
    });

    pushNotification.on('registration', function (data) {
        actions.saveRegistrationIdOfNotification({
            registrationId: data.registrationId
        });
    });

    pushNotification.on('notification', function (data) {
        var setTimeoutId = setTimeout(function () {
            actions.checkTask({
                taskTypes: "All",
                emitEvent: false
            });
            clearTimeout(setTimeoutId);
        }, 0);
        pushNotification.finish(function () {
            console.log("processing of push data is finished");
        });
    });

    pushNotification.on('error', function (e) {
        actions.showToast({
            text: e.message
        });
    });
});
