define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var Splash = React.createClass({
        componentDidMount: function () {
            store.addTaskChangeListener(this._onTaskChange);
            var setTimeoutId = setTimeout(function () {
                actions.checkTask({
                    taskTypes: "All",
                    emitEvent: true
                });
                clearTimeout(setTimeoutId);
            }, 0);
            mixpanel.track("App-Splash-Loaded");
        },
        componentWillUnmount: function () {
            store.removeTaskChangeListener(this._onTaskChange);
        },
        _onTaskChange: function () {
            actions.changeUrl({
                href: "/root/task"
            });
        },
        render: function () {
            return (
                <div className="SplashContainer">
                    <div className="grc-icon"></div>
                    <div className="splashTextContainer">
                        <div className="line1">
                            <span>Metric</span>
                            <span>Stream</span>
                        </div>
                        <div className="line2">
                            <span>
                                PULSE
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
    });
    return Splash;
});
