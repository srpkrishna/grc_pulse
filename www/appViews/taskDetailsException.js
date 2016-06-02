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
        },
        _onApproveDisapprove: function () {
            setTimeout(function () {
                actions.checkTask({
                    taskTypes: "All",
                    emitEvent: true
                });
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
                    requestedExceptionId: that.state.data.Requested_Exception__c,
                    taskId: that.props.taskId
                });
                clearTimeout(setTimeOutId);
            }, 0);
        },
        componentWillUnmount: function () {
            store.removeExceptionCommentAvailableListener(this._onCommentFetched);
            store.removeApproveDisapproveExceptionListener(this._onApproveDisapprove);
            store.removeTaskChangeListener(this._onTaskChange);
        },
        render: function () {
            var data = this.state.data;
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
                        React.createElement("div", {className: "summaryTaskDetails"}, data.Summary__c), 
                        React.createElement("div", {className: "exceptionComment"}, 
                            React.createElement("div", null), 
                            React.createElement("div", null, data.Comment__c)
                        ), 
                        React.createElement("div", {className: "approveDisapproveExceptionContainer", onClick: this._onClickApproveDisapprove}, 
                            React.createElement("div", {className: "taskDisapproved", "data-type": "Disapproved"}), 
                            React.createElement("div", {className: "taskApproved", "data-type": "Approved"})
                        )
                    )
                )
            );
        }
    });
});