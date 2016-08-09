define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");

    function getState() {
        return {
            exceptionList: store.getExceptionList()
        }
    }

    var Exception = React.createClass({displayName: "Exception",
        getInitialState: function () {
            this.isActive = false;
            this.isCommentFieldVisible = false;
            return {};
        },
        componentDidMount: function () {
            store.addExceptionRequestSendListener(this._onExceptionSend);
        },
        componentWillUnmount: function () {
            store.removeExceptionRequestSendListener(this._onExceptionSend);
        },
        _onExceptionSend: function (data) {
            if (data.success && data.expId === this.props.data.Id) {
                this.isCommentFieldVisible = false;
                this.setState({});
            }
        },
        _onClick: function () {
            if (this.isActive) {
                if (!this.isCommentFieldVisible) {
                    this.isCommentFieldVisible = true;
                    this.setState({});
                    mixpanel.track("App-On-Exception-Clicked");
                }
                else {
                    var comment = store.getUserCommentForException(this.props.data.Id);
                    if (comment && comment !== "") {
                        actions.requestException({
                            exceptionId: this.props.data.Id,
                            comment: new String(comment)
                        });
                        mixpanel.track("App-On-Exception-Requested");
                        store.setUserCommentForException(this.props.data.Id, "");
                    }
                }
            }
        },
        _onCommentChange: function (event) {
            var text = event.target.value;
            if (text || text === "") {
                store.setUserCommentForException(this.props.data.Id, text);
                this.setState({});
            }
        },
        render: function () {
            var packName = this.props.data.grcpulse__Policy__r.grcpulse__Pack__r ? this.props.data.grcpulse__Policy__r.grcpulse__Pack__r.Name : "";
            var dept = this.props.data.grcpulse__IT_Team_Name__c || "";
            var userExceptionStatus = store.isThisUserExceptionActive(this.props.data.Id);
            this.isActive = userExceptionStatus.isActive;
            this.isActive = (this.props.data.grcpulse__Concurrent_Request_Allowed__c ? this.props.data.grcpulse__Concurrent_Request_Allowed__c : this.isActive);
            var status = this.isActive ? (this.isCommentFieldVisible ? "submit" : "request") : userExceptionStatus.status;
            var requestButtonCSS = this.isActive ? "requestBtActive" : "requestBtInActive";
            var commentFieldCss = "exceptionCommentContainer" + (this.isCommentFieldVisible ? "" : " visibilityNone");
            var exceptionRowCss = "exceptionRow" + (this.isCommentFieldVisible ? " exceptionRowExpanded" : "");
            return (
                React.createElement("div", {className: exceptionRowCss}, 
                    React.createElement("div", {className: "exceptionsContainer"}, 
                        React.createElement("div", {className: "exceptionTitle"}, this.props.data.Name), 
                        React.createElement("div", {className: "exceptionInfo"}, 
                            React.createElement("div", null, 
                                React.createElement("div", {className: "packNameInTaskList"}, packName), 
                                React.createElement("div", {className: "deptTaskDetail"}, dept)
                            ), 
                            React.createElement("div", {onClick: this._onClick, className: requestButtonCSS}, getString(status))
                        ), 
                        React.createElement("div", {className: commentFieldCss}, 
                            React.createElement("textarea", {ref: this.props.data.Id, 
                                      onChange: this._onCommentChange, 
                                      value: store.getUserCommentForException(this.props.data.Id), 
                                      placeholder: getString("exception_reason_place_holder")}
                            )
                        )
                    )
                )
            );
        }
    });
    var ExceptionList = React.createClass({displayName: "ExceptionList",
        render: function () {
            var exceptions = this.props.exceptions, counter = 0;
            var exceptionsNodes = exceptions.map(function (exception) {
                return (
                    React.createElement(Exception, {data: exception, key: counter++})
                );
            });
            if (exceptions.length) {
                return (
                  React.createElement("div", null, 
                    React.createElement("div", {className: "pageTitle"}, getString("exceptions")), 
                    React.createElement("div", {className: "pageContainer", id: "exceptionListContainer"}, 
                      exceptionsNodes
                    )
                  )
                );
            }
            else {
                return (
                  React.createElement("div", null, 
                    React.createElement("div", {className: "pageTitle"}, getString("exceptions")), 
                    React.createElement("div", {className: "pageContainer", id: "exceptionListContainer"}, 
                      React.createElement("div", {className: "noTask"}, getString("no_exceptions"))
                    )
                  )
                );
            }
        }
    });
    var exception = React.createClass({displayName: "exception",
        getInitialState: function () {
            return getState();
        },
        componentDidMount: function () {
            store.addExceptionListAvailableListener(this._onExceptionListChange);
            var setTimeOutId = setTimeout(function () {
                actions.getExceptionList();
                clearTimeout(setTimeOutId);
            }, 0);
            mixpanel.track("App-On-Exception-Loaded");
        },
        componentWillUnmount: function () {
            store.removeExceptionListAvailableListener(this._onExceptionListChange);
        },
        _onExceptionListChange: function () {
            this.setState(getState());
        },
        render: function () {
            return (
                React.createElement(ExceptionList, {exceptions: this.state.exceptionList})
            );
        }
    });
    return exception;
});
