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
                    requestedExceptionId: that.state.data.grcpulse__Requested_Exception__c,
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
            var approveLevels = data.grcpulse__Exception_Approver_Level__c;
            if (approveLevels && (typeof approveLevels === "string")) {
                try {
                    approveLevels = $.parseJSON(approveLevels);
                }
                catch (e) {
                    console.log("ERROR: " + e);
                }
            }
            if (data.grcpulse__Activity_Task__c && approveLevels && (typeof approveLevels === "object")) {
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
                        <div key={index}>{status}</div>
                    );
                });
                approveNode = (
                    <div className="exceptionTaskStatus">
                        <div>{getString("status")}</div>
                        <div>{levelsNode}</div>
                    </div>
                );
                exceptionActions = (
                    <div className="approveDisapproveExceptionContainer" onClick={this._onClickApproveDisapprove}>
                        <div className="activityTaskApproved" data-type="Approved"></div>
                    </div>
                );
            }
            else if (!data.grcpulse__Activity_Task__c) {
                exceptionActions = (
                    <div className="approveDisapproveExceptionContainer" onClick={this._onClickApproveDisapprove}>
                        <div className="taskDisapproved" data-type="Disapproved"></div>
                        <div className="taskApproved" data-type="Approved"></div>
                    </div>
                );
            }
            return (
                <div className="pageContainer">
                    <div className="pageTitle">{getString("task_details")}</div>
                    <div className="exceptionDetailsContainer">
                        <div className="packContainerInTaskList">
                            <div className="packNameInTaskList">
                                {data.packName}
                            </div>
                        </div>
                        <div className="titleContainer">
                            <div className="title">{data.Name}</div>
                        </div>
                        <div className="summaryTaskDetails">{data.grcpulse__Summary__c}</div>
                        <div className="exceptionComment">
                            <div></div>
                            <div>{data.grcpulse__Comment__c}</div>
                        </div>
                        {approveNode}
                        {exceptionActions}
                    </div>
                </div>
            );
        }
    });
});
