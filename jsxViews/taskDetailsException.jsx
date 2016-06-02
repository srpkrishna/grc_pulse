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
                        <div className="summaryTaskDetails">{data.Summary__c}</div>
                        <div className="exceptionComment">
                            <div></div>
                            <div>{data.Comment__c}</div>
                        </div>
                        <div className="approveDisapproveExceptionContainer" onClick={this._onClickApproveDisapprove}>
                            <div className="taskDisapproved" data-type="Disapproved"></div>
                            <div className="taskApproved" data-type="Approved"></div>
                        </div>
                    </div>
                </div>
            );
        }
    });
});