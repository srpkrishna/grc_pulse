define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var db = store.getNewDB();

    var Attestation = React.createClass({
        getInitialState: function () {
            return {isActive: false};
        },
        componentDidMount: function () {
            this.query();
            store.addTaskIsCompletedListener(this._onTaskCompleteServerUpdate);
            store.addTaskIsCompletedDBUpdatedListener(this._onTaskCompleteDBUpdate);
            store.addTaskChangeListener(this._onTaskChange);
            mixpanel.track("App-On-Attestation-Loaded");
            //this.addEvents();
        },
        componentWillUnmount: function () {
            store.removeTaskIsCompletedListener(this._onTaskCompleteServerUpdate);
            store.removeTaskIsCompletedDBUpdatedListener(this._onTaskCompleteDBUpdate);
            store.removeTaskChangeListener(this._onTaskChange);
        },
        query: function () {
            var that = this;
            db.getResourcesByTaskId(this.props.taskId, function (response) {
                if (response) {
                    var isActive = true;
                    for (var i = 0; i < response.length; i++) {
                        if (!response.item(i).status) {
                            isActive = false;
                            break;
                        }
                    }
                    that._onDBCallback(isActive);
                }
            });
        },
        _onDBCallback: function (status) {
            this.setState({
                isActive: status
            });
        },
        _onTaskCompleteServerUpdate: function () {
            var that = this;
            setTimeout(function () {
                actions.updateDBOnTaskComplete({
                    taskId: that.props.taskId
                });
            }, 0);
        },
        _onTaskCompleteDBUpdate: function () {
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
        _onActive: function () {
            this.setState(getState());
        },
        addEvents: function () {
            var element = document.getElementById("swip_to_attest");
            var ha = new Hammer.Manager(element);
            ha.add(new Hammer.Swipe({direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0}));
            ha.on("swiperight", this._onSwipe);
            ha.on("swipeleft", this._onSwipe);
        },
        _onClick: function () {
            this._onSwipe();
        },
        _onSwipe: function () {
            var that = this;
            if (this.state.isActive) {
                navigator.notification.confirm(
                    getString("attestation_confirm_msg"),
                    function (index) {
                        switch (index) {
                            case 1:
                            {
                                actions.taskIsComplete({
                                    taskId: that.props.taskId
                                });
                                mixpanel.track("App-On-Attestation-Clicked");
                                break;
                            }
                            case 2:
                            {
                                actions.changeUrl({
                                    href: "/root/task"
                                });
                                mixpanel.track("App-On-Attestation-Declined");
                                break;
                            }
                        }
                    },
                    getString("confirm_attestation"),
                    [getString("yes"), getString("no")]
                );
            }
        },
        _onMessageComplete: function () {
            actions.taskIsComplete({
                taskId: this.props.taskId
            });
            mixpanel.track("App-On-Message-Read");
        },
        render: function () {
            if (this.props.isMessage) {
                return (
                    <div className="messageDone" onClick={this._onMessageComplete}>{getString("done")}</div>
                );
            }
            else {
                var activeCss = (this.state.isActive ? "attestationBt attestationActive" : "attestationBt");
                return (
                    <div className="attestationContainer" id={"swip_to_attest"} onClick={this._onClick}>
                        <div className={activeCss}>{getString("swip_to_attest")}</div>
                    </div>
                );
            }
        }
    });
    return Attestation;
});
