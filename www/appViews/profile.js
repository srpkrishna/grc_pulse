define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");

    function getState() {
        return {
            userInfo: store.getUserInfo(),
            userProfileURL: store.getUserProfileUrl(),
            taskCount: store.getTaskCount()
        };
    }

    var Profile = React.createClass({displayName: "Profile",
        getInitialState: function () {
            return getState();
        },
        componentDidMount: function () {
            store.addUserInfoFetchListener(this._onUserInfo);
            store.addUserProfileImageListener(this._onUserProfileImage);
            var setTimeOutId = setTimeout(function () {
                actions.getUserInfo();
                clearTimeout(setTimeOutId);
            }, 0);
            mixpanel.track("App-On-Profile-Loaded");
        },
        componentWillUnmount: function () {
            store.removeUserInfoFetchListener(this._onUserInfo);
            store.removeUserProfileImageListener(this._onUserProfileImage);
        },
        _onUserInfo: function () {
            this.setState(getState());
            var that = this;
            var setTimeOutId = setTimeout(function () {
                actions.getUserProfileImage({
                    url: that.state.userInfo.FullPhotoUrl,
                    fileName: that.state.userInfo.Name
                });
                clearTimeout(setTimeOutId);
            }, 0);
        },
        _onUserProfileImage: function () {
            this.setState(getState());
        },
        _onTalkToUsClicked: function () {
            actions.changeUrl({
                href: "/talkToUs"
            });
            mixpanel.track("App-On-Profile-Feedback-Clicked");
        },
        _onLogout: function () {
            actions.logout();
            mixpanel.track("App-On-Profile-Logout");
        },
        _onMessage: function () {
            actions.changeUrl({
                href: "/message"
            });
            mixpanel.track("App-On-Profile-Drip-Message-Clicked");
        },
        render: function () {
            var userInfo = this.state.userInfo;
            var img = this.state.userProfileURL ? this.state.userProfileURL : "file:///android_asset/www/css/img/user-default-image.png";
            var name = userInfo ? userInfo.Name : "";
            var taskInfo = this.state.taskCount + (this.state.taskCount > 1 ? getString("tasks_pending") : getString("task_pending"));
            var message = (userInfo && userInfo.grcpulse__CanSendPublicMessage__c ? (
                React.createElement("div", {className: "sendMessageBt", onClick: this._onMessage}, 
                    React.createElement("div", null, 
                        React.createElement("div", null), 
                        React.createElement("div", null, getString("send_out_message"))
                    )
                )
            ) : null);
            return (
                React.createElement("div", {className: "pageContainer"}, 
                    React.createElement("div", {className: "profileInfoContainer"}, 
                        React.createElement("div", {className: "profileContainer"}, 
                            React.createElement("div", {className: "userProfileImgContainer"}, 
                                React.createElement("img", {src: img})
                            ), 
                            React.createElement("div", {className: "profileUserName"}, 
                                name
                            )
                        ), 
                        React.createElement("div", {className: "profileTaskCount"}, 
                            taskInfo
                        )
                    ), 
                    message, 
                    React.createElement("div", {className: "talkToUs", onClick: this._onTalkToUsClicked}, "Talk to us"), 
                    React.createElement("div", {className: "legalAndCopyRight"}, 
                        React.createElement("div", null, getString("legal")), 
                        React.createElement("div", null, getString("copyright_text"))
                    ), 
                    React.createElement("div", {className: "logout", onClick: this._onLogout})
                )
            );
        }
    });
    return Profile;
});
