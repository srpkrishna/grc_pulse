define(function (require) {
    var userActionList = require("./helper/userActionsConstants");
    var actions = require("util/actions");
    var UserAction = React.createClass({displayName: "UserAction",
        _onClick: function (event) {
            userActionList.setActiveAction(this.props.data.id);
            actions.changeUrl({
                href: this.props.data.href
            });
        },
        render: function () {
            var cssClass = "user-action-icon " + (this.props.data.activeView ? this.props.data.cssClass + "-active" : this.props.data.cssClass);
            return (
                React.createElement("div", {className: "bottom_tab"}, 
                    React.createElement("div", {className: cssClass, onClick: this._onClick})
                )
            );
        }
    });
    var ActionList = React.createClass({displayName: "ActionList",
        render: function () {
            var actions = this.props.actions, counter = 0, that = this;
            var actionsNodes = actions.map(function (action) {
                return (
                    React.createElement(UserAction, {data: action, key: counter++})
                );
            });
            var cssClass = "userTaskBackground " + (userActionList.isTaskActive() ? "userTaskBackground-active" : "userTaskBackground-inactive");
            return (
                React.createElement("div", {className: "bottom_tab_bar"}, 
                    React.createElement("div", {className: cssClass}), 
                    actionsNodes
                )
            );
        }
    });
    var userActionContainer = React.createClass({displayName: "userActionContainer",
        render: function () {
            return (
                React.createElement(ActionList, {actions: userActionList.getActionList()})
            )
        }
    });
    return userActionContainer;
});
