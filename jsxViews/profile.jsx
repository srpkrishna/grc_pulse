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

    var Profile = React.createClass({
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
            var message = (userInfo && userInfo.grcpulse_CanSendPublicMessage__c ? (
                <div className="sendMessageBt" onClick={this._onMessage}>
                    <div>
                        <div></div>
                        <div>{getString("send_out_message")}</div>
                    </div>
                </div>
            ) : null);
            return (
                <div className="pageContainer">
                    <div className="profileInfoContainer">
                        <div className="profileContainer">
                            <div className="userProfileImgContainer">
                                <img src={img}/>
                            </div>
                            <div className="profileUserName">
                                {name}
                            </div>
                        </div>
                        <div className="profileTaskCount">
                            {taskInfo}
                        </div>
                    </div>
                    {message}
                    <div className="talkToUs" onClick={this._onTalkToUsClicked}>Talk to us</div>
                    <div className="legalAndCopyRight">
                        <div>{getString("legal")}</div>
                        <div>{getString("copyright_text")}</div>
                    </div>
                    <div className="logout" onClick={this._onLogout}></div>
                </div>
            );
        }
    });
    return Profile;
});
