define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var Splash = React.createClass({displayName: "Splash",
        componentDidMount: function () {
            store.addTaskChangeListener(this._onTaskChange);
            setTimeout(function () {
                actions.checkTask({
                    taskTypes: "All",
                    emitEvent: true
                });
            }, 0);
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
                React.createElement("div", {className: "SplashContainer"}, 
                    React.createElement("div", {className: "grc-icon"}), 
                    React.createElement("div", {className: "splashTextContainer"}, 
                        React.createElement("div", {className: "line1"}, 
                            React.createElement("span", null, "Metric"), 
                            React.createElement("span", null, "Stream")
                        ), 
                        React.createElement("div", {className: "line2"}, 
                            React.createElement("span", null, 
                                "PULSE"
                            )
                        )
                    )
                )
            );
        }
    });
    return Splash;
});
