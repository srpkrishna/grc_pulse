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
                        React.createElement("div", null, 
                            React.createElement(Splash, null)
                        )
                    );
                } else if (url.match(/videoViewer/ig)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Back, null), 
                            React.createElement(VideoViewer, null), 
                            React.createElement(UserActions, null)
                        )
                    );
                } else if (url.match(/packDetails/ig)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Back, null), 
                            React.createElement(PackDetails, null), 
                            React.createElement(UserActions, null)
                        )
                    );
                } else if (url.match(/policyDetails/ig)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Back, null), 
                            React.createElement(PolicyDetails, null), 
                            React.createElement(UserActions, null)
                        )
                    );
                }
                else if (match = url.match(/viewer/ig)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Back, null), 
                            React.createElement(Viewer, null), 
                            React.createElement(UserActions, null)
                        )
                    );
                }
                else if (match = url.match(/taskDetailsExc/ig)) {
                    var lastIndex = url.lastIndexOf("/");
                    var parameter = url.substring(lastIndex + 1, url.length);
                    return (
                        React.createElement("div", null, 
                            React.createElement(Back, null), 
                            React.createElement(TaskDetailsException, {taskId: parameter}), 
                            React.createElement(UserActions, null)
                        )
                    );
                }
                else if (url.match(/exception/ig)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Exception, null), 
                            React.createElement(UserActions, null)
                        )
                    );
                }
                else if (match = url.match(/taskDetails/ig)) {
                    var lastIndex = url.lastIndexOf("/");
                    var parameter = url.substring(lastIndex + 1, url.length);
                    return (
                        React.createElement("div", null, 
                            React.createElement(Back, null), 
                            React.createElement(TaskDetails, {taskId: parameter}), 
                            React.createElement(UserActions, null)
                        )
                    );
                }
                else if (url.match(/hub/ig)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Packs, null), 
                            React.createElement(UserActions, null)
                        )
                    );
                }
                else if (url.match(/index.html/ig)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Task, null), 
                            React.createElement(UserActions, null)
                        )
                    );
                }
                else if (url.match(/task/ig)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Task, null), 
                            React.createElement(UserActions, null)
                        )
                    );
                }
                else if (url.match(/profile/ig)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Profile, null), 
                            React.createElement(UserActions, null)
                        )
                    );
                }
                else if (url.match(/incident/g)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Incident, null), 
                            React.createElement(UserActions, null)
                        )
                    );
                }
                else if (url.match(/reportIncident/g)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Back, null), 
                            React.createElement(IncidentQuestionnaires, null)
                        )
                    );
                }
                else if (url.match(/questions/ig)) {
                    var params = url.split("/");
                    return (
                        React.createElement("div", null, 
                            React.createElement(Back, null), 
                            React.createElement(Questionnaires, {taskId: params[2], questionId: params[3]})
                        )
                    );
                }
                else if(url.match(/talkToUs/ig)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Back, null), 
                            React.createElement(TalkToUs, null)
                        )
                    );
                }
                else if(url.match(/message/ig)) {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Back, null), 
                            React.createElement(Message, null)
                        )
                    );
                }
                else {
                    return (
                        React.createElement("div", null, 
                            React.createElement(Task, null), 
                            React.createElement(UserActions, null)
                        )
                    );
                }
            }
        },
        render: function () {
            var content = this.getContent();
            return (
                React.createElement("div", null, 
                    content
                )
            );
        }
    });
    return app;
});
