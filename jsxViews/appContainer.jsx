define(function (require) {
    var store = require("util/store");
    var Header = require("./header");
    var Task = require("./task");
    var Packs = require("./packs");
    var PackDetails = require("./packDetails");
    var PolicyDetails = require("./policyDetails");
    var VideoViewer = require("./videoViewer");
    var UserActions = require("./userActions");
    var TaskDetails = require("./taskDetails");
    var TaskDetailsException = require ("./taskDetailsException");
    var Viewer = require("./viewer");
    var Splash = require("./splash");
    var Exception = require("./exception");
    var Back = require("./back");
    var Profile = require("./profile");
    var Incident = require("./reportIncident/Incident");
    var IncidentQuestionnaires = require("./reportIncident/IncidentQuestionary");
    var Questionnaires = require("./questionnaires/questionContainer");
    var TalkToUs = require("./talkToUs");
    var Message = require("./message");
    function getState() {
        return {
            url: store.getAppUrl()
        };
    }

    var app = React.createClass({
        displayName: 'App',
        getInitialState: function () {
            return getState();
        },
        componentDidMount: function () {
            store.addAppUrlChangeListener(this._onChangeUrl);
        },
        componentWillUnmount: function () {
            store.removeAppUrlChangeListener(this._onChangeUrl);
        },
        _onChangeUrl: function () {
            this.setState(getState());
        },
        getContent: function () {
            var url = this.state.url, match = null;
            if (url) {
                if (match = url.match(/splash/ig)) {
                    return (
                        <div>
                            <Splash />
                        </div>
                    );
                } else if (url.match(/videoViewer/ig)) {
                    return (
                        <div>
                            <Back />
                            <VideoViewer />
                            <UserActions />
                        </div>
                    );
                } else if (url.match(/packDetails/ig)) {
                    return (
                        <div>
                            <Back />
                            <PackDetails />
                            <UserActions />
                        </div>
                    );
                } else if (url.match(/policyDetails/ig)) {
                    return (
                        <div>
                            <Back />
                            <PolicyDetails />
                            <UserActions />
                        </div>
                    );
                }
                else if (match = url.match(/viewer/ig)) {
                    return (
                        <div>
                            <Back />
                            <Viewer />
                            <UserActions />
                        </div>
                    );
                }
                else if (match = url.match(/taskDetailsExc/ig)) {
                    var lastIndex = url.lastIndexOf("/");
                    var parameter = url.substring(lastIndex + 1, url.length);
                    return (
                        <div>
                            <Back />
                            <TaskDetailsException taskId={parameter}/>
                            <UserActions />
                        </div>
                    );
                }
                else if (url.match(/exception/ig)) {
                    return (
                        <div>
                            <Exception />
                            <UserActions />
                        </div>
                    );
                }
                else if (match = url.match(/taskDetails/ig)) {
                    var lastIndex = url.lastIndexOf("/");
                    var parameter = url.substring(lastIndex + 1, url.length);
                    return (
                        <div>
                            <Back />
                            <TaskDetails taskId={parameter}/>
                            <UserActions />
                        </div>
                    );
                }
                else if (url.match(/hub/ig)) {
                    return (
                        <div>
                            <Packs />
                            <UserActions />
                        </div>
                    );
                }
                else if (url.match(/index.html/ig)) {
                    return (
                        <div>
                            <Task />
                            <UserActions />
                        </div>
                    );
                }
                else if (url.match(/task/ig)) {
                    return (
                        <div>
                            <Task />
                            <UserActions />
                        </div>
                    );
                }
                else if (url.match(/profile/ig)) {
                    return (
                        <div>
                            <Profile />
                            <UserActions />
                        </div>
                    );
                }
                else if (url.match(/incident/g)) {
                    return (
                        <div>
                            <Incident />
                            <UserActions />
                        </div>
                    );
                }
                else if (url.match(/reportIncident/g)) {
                    return (
                        <div>
                            <Back />
                            <IncidentQuestionnaires />
                        </div>
                    );
                }
                else if (url.match(/questions/ig)) {
                    var params = url.split("/");
                    return (
                        <div>
                            <Back />
                            <Questionnaires taskId={params[2]} questionId={params[3]}/>
                        </div>
                    );
                }
                else if(url.match(/talkToUs/ig)) {
                    return (
                        <div>
                            <Back />
                            <TalkToUs />
                        </div>
                    );
                }
                else if(url.match(/message/ig)) {
                    return (
                        <div>
                            <Back />
                            <Message />
                        </div>
                    );
                }
                else {
                    return (
                        <div>
                            <Task />
                            <UserActions />
                        </div>
                    );
                }
            }
        },
        render: function () {
            var content = this.getContent();
            return (
                <div>
                    {content}
                </div>
            );
        }
    });
    return app;
});
