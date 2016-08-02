mixpanel.track("App-Init");
var languagesSupported = ["en-US", "fr", "ho"];
var defaultLanguage = "en-US";
var loginUrl = "https://login.salesforce.com/";
var clientId = "";
var redirectUri = "testsfdc:///mobilesdk/detect/oauth/done";
window.ms = {};
window.ms.grcPulse = {};
window.ms.pushNotification = {};

requirejs.config({
    baseUrl: "lib",
    paths: {
        app: "../appViews",
        util: "../util",
        js: "../lib"
    }
});
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.lastIndexOf(searchString, position) === position;
    };
}
function getAuthorizeUrl() {
    return loginUrl + 'services/oauth2/authorize?display=touch'
        + '&response_type=token&client_id=' + encodeURIComponent(clientId)
        + '&redirect_uri=' + encodeURIComponent(redirectUri);
}
function getClientId()
{
    if(device.platform === "Android")
    {
        return "3MVG9KI2HHAq33RylJct15Ip2rnEEnLc2nsPQ9ssY0t8w0RT3PZ1.x.tJDpSVizS3V5INYw51NQZXVg7Zkgtm";
    }else {
        return "3MVG9KI2HHAq33RylJct15Ip2risbGTPz.1oAc1YhjyEX3mKv8Q.i0jsEeh410_LD22ZVEydsN3hXqrzfMgFm";
    }

}


function onDeviceReady() {
    $("#loading").removeClass("hide");
    clientId = getClientId();
    require(["util/store"], function (store) {
        var db = store.getNewDB();
        db.getLoginInfo("refresh_token", function (refresh_token) {
            if (refresh_token) {
                refresh_token = sjcl.decrypt(device.uuid, JSON.parse(refresh_token));
                window.ms.grcPulse.forceClient = new forcetk.Client(clientId, loginUrl);
                window.ms.grcPulse.forceClient.setRefreshToken(refresh_token);
                window.ms.grcPulse.forceClient.refreshAccessToken(function (response) {
                    $("#loading").addClass("hide");
                    setSessionResponseData(response);
                }, function () {
                    $("#loading").addClass("hide");
                    console.log("ERROR: refresh access token");
                });
            }
            else {
                ref = cordova.InAppBrowser.open (getAuthorizeUrl(), '_blank', 'location=no,clearcache=yes,zoom=no,toolbar=no');
                var eventName = device.platform === "Android" ? 'loadstop' : "loadstart";
                ref.addEventListener(eventName, function(evt) {
                    if (evt.url.startsWith(redirectUri)) {
                        $("#loading").addClass("hide");
                        ref.close();
                        sessionCallback(decodeURIComponent(evt.url));
                    }
                });
            }
        });
    });
    handleEvents();
}
function sessionCallback(loc) {
    window.ms.grcPulse.forceClient = new forcetk.Client(clientId, loginUrl);
    var oauthResponse = {};
    var fragment = loc.split("#")[1];
    if (fragment) {
        var nvps = fragment.split('&');
        for (var nvp in nvps) {
            var parts = nvps[nvp].split('=');
            oauthResponse[parts[0]] = decodeURIComponent(parts[1]);
        }
    }
    if (typeof oauthResponse === 'undefined' || typeof oauthResponse['access_token'] === 'undefined') {
        alert("Unauthorized: No OAuth response");
    }
    else {
        mixpanel.track("App-Login-Success-First-Time");
        setSessionResponseData(oauthResponse);
    }
}
function setSessionResponseData(response) {
    var index = response.id.lastIndexOf("/");
    window.ms.grcPulse.user = {userId: response.id.substring(index + 1, response.length)};
    window.ms.grcPulse.forceClient.setSessionToken(response.access_token, "v33.0", response.instance_url);
    if (response.refresh_token) {
        window.ms.grcPulse.forceClient.setRefreshToken(response.refresh_token);
    }
    mixpanel.track("App-Login-Success");
    requirejs(["app/main", "util/notification"], function () {
        var loginInfo = {};
        for (var key in response) {
            if(response.hasOwnProperty(key)){
                loginInfo[key] = JSON.stringify(sjcl.encrypt(device.uuid, response[key]));
            }
        }
        var actions = require("util/actions");
        if (loginInfo.refresh_token) {
            actions.saveLoginInfo({
                info: loginInfo
            });
        }
        else {
            actions.updateLoginInfo({
                info: loginInfo
            });
        }
    });
}
function handleEvents() {
    document.addEventListener("backbutton", function () {
        require("util/actions").changeUrl ({
            href: -1
        });
    }, false);
}
requirejs(["util/config", "jquery-2.2.4.min", "react", "react-dom.min", "l20n.min", "flux.min", "sjcl"], function (CONFIG, jquery, react, reactDOM, l20n) {
    requirejs(["forcetk.mobilesdk"], function () {
        window.React = react;
        window.ReactDOM = reactDOM;
        window.l20n = L20n.getContext ();
        window.l20n.addResource("<current_year '" + (new Date()).getFullYear() + "'>");
        window.getString = function () {
            var value;
            if (arguments.length === 1) {
                value = window.l20n.getSync(arguments[0]);
            }
            else if (arguments.length === 2) {
                value = window.l20n.getSync(arguments[0], arguments[1]);
            }
            else {
                value = "Error in no. Arguments";
            }
            return value;
        };
        window.l20n.registerLocales (defaultLanguage, languagesSupported);
        window.l20n.linkResource (function (locale) {
            var browserLanguage = defaultLanguage;//navigator.language;
            $ ("head").append ("<meta http-equiv='Content-Language' content = '" + browserLanguage + "'/>");
            return "locales/" + browserLanguage + ".l20n";
        });
        window.l20n.requestLocales ();
        window.l20n.ready (function () {
            requirejs(["hammer.min"], function (hammer) {
                window.Hammer = hammer;
            });
        });
        document.addEventListener("deviceready", onDeviceReady, false);
    });
});
