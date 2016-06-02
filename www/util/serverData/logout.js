/**
 * Created by asinha on 26/05/16.
 */
define(function (require) {
    var logout = function (successCB, failureCB) {
        $.ajax({
            url: "https://login.salesforce.com/services/oauth2/revoke",
            type: "POST",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            data: {token: window.localStorage.getItem("refresh_token")},
            success: function (data) {
                $("#loading").addClass("hide");
                if(successCB) {
                    successCB (data);
                }
            },
            error: function (xhr) {
                $("#loading").addClass("hide");
                if(failureCB) {
                    failureCB (xhr);
                }
            },
            beforeSend: function () {
                $("#loading").removeClass("hide");
            }
        })
    };
    return logout;
});