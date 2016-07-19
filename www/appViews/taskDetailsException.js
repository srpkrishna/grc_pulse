define (function(require) {
    var store = require("util/store");
    var actions = require("util/actions");
    return React.createClass({
        getInitialState: function () {
            return {
                data: store.getTaskDetails(this.props.taskId)
            };
        },
        _onClickApproveDisapprove: function (event) {
            var type = event.target.getAttribute("data-type");
            actions.sendApproveDisapproveException({
                type: type,
                taskId: this.props.taskId
            });
            mixpanel.track("App-On-Exception-Task-" + type);
        },
        _onApproveDisapprove: function () {
            var setTimeoutId = setTimeout(function () {
                actions.checkTask({
                    taskTypes: "All",
                    emitEvent: true
                });
                clearTimeout(setTimeoutId);
            }, 0);
        },
        _onTaskChange: function () {
            actions.changeUrl({
                href: "/root/task"
            });
        },
        _onCommentFetched: function () {
            this.setState({
                data: store.getTaskDetails(this.props.taskId)
            });
        },
        componentDidMount: function () {
            store.addExceptionCommentAvailableListener(this._onCommentFetched);
            store.addApproveDisapproveExceptionListener(this._onApproveDisapprove);
            store.addTaskChangeListener(this._onTaskChange);
            var that = this;
            var setTimeOutId = setTimeout(function () {
                actions.getExceptionComments ({
                    requestedExceptionId: that.state.data.grcpulse_Requested_Exception__c,
                    taskId: that.props.taskId
                });
                clearTimeout(setTimeOutId);
            }, 0);
            mixpanel.track("App-On-Exception-Task-Loaded");
        },
        componentWillUnmount: function () {
            store.removeExceptionCommentAvailableListener(this._onCommentFetched);
            store.removeApproveDisapproveExceptionListener(this._onApproveDisapprove);
            store.removeTaskChangeListener(this._onTaskChange);
        },
        render: function () {
            var data = this.state.data;
            var approveNode = null, exceptionActions;
            var approveLevels = data.grcpulse_Exception_Approver_Level__c;
            if (approveLevels && (typeof approveLevels === "string")) {
                try {
                    approveLevels = $.parseJSON(approveLevels);
                }
                catch (e) {
                    console.log("ERROR: " + e);
                }
            }
            if (data.grcpulse_Activity_Task__c && approveLevels && (typeof approveLevels === "object")) {
                var levelsNode = approveLevels.map(function (level, index) {
                    var status = "";
                    var statusData = {name: (level.name ? level.name : "")};
                    if (level.status === "Approved") {
                        status = getString("activity_task_approved", statusData);
                    }
                    else {
                        status = getString("activity_task_pending", statusData);
                    }
                    return (
                        React.createElement("div", {key: index}, status)
                    );
                });
                approveNode = (
                    React.createElement("div", {className: "exceptionTaskStatus"}, 
                        React.createElement("div", null, getString("status")), 
                        React.createElement("div", null, levelsNode)
                    )
                );
                exceptionActions = (
                    React.createElement("div", {className: "approveDisapproveExceptionContainer", onClick: this._onClickApproveDisapprove}, 
                        React.createElement("div", {className: "activityTaskApproved", "data-type": "Approved"})
                    )
                );
            }
            else if (!data.grcpulse_Activity_Task__c) {
                exceptionActions = (
                    React.createElement("div", {className: "approveDisapproveExceptionContainer", onClick: this._onClickApproveDisapprove}, 
                        React.createElement("div", {className: "taskDisapproved", "data-type": "Disapproved"}), 
                        React.createElement("div", {className: "taskApproved", "data-type": "Approved"})
                    )
                );
            }
            return (
                React.createElement("div", {className: "pageContainer"}, 
                    React.createElement("div", {className: "pageTitle"}, getString("task_details")), 
                    React.createElement("div", {className: "exceptionDetailsContainer"}, 
                        React.createElement("div", {className: "packContainerInTaskList"}, 
                            React.createElement("div", {className: "packNameInTaskList"}, 
                                data.packName
                            )
                        ), 
                        React.createElement("div", {className: "titleContainer"}, 
                            React.createElement("div", {className: "title"}, data.Name)
                        ), 
                        React.createElement("div", {className: "summaryTaskDetails"}, data.grcpulse_Summary__c), 
                        React.createElement("div", {className: "exceptionComment"}, 
                            React.createElement("div", null), 
                            React.createElement("div", null, data.grcpulse_Comment__c)
                        ), 
                        approveNode, 
                        exceptionActions
                    )
                )
            );
        }
    });
});
