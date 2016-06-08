define(function (require) {
    var userActionList = require("./helper/userActionsConstants");
    var actions = require("util/actions");
    var UserAction = React.createClass({
        _onClick: function (event) {
            userActionList.setActiveAction(this.props.data.id);
            actions.changeUrl({
                href: this.props.data.href
            });
            mixpanel.track("App-On-UserAction-Clicked-" + this.props.data.text);
        },
        render: function () {
            var cssClass = "user-action-icon " + (this.props.data.activeView ? this.props.data.cssClass + "-active" : this.props.data.cssClass);
            return (
                <div className="bottom_tab">
                    <div className={cssClass} onClick={this._onClick}></div>
                </div>
            );
        }
    });
    var ActionList = React.createClass({
        render: function () {
            var actions = this.props.actions, counter = 0, that = this;
            var actionsNodes = actions.map(function (action) {
                return (
                    <UserAction data={action} key={counter++}/>
                );
            });
            var cssClass = "userTaskBackground " + (userActionList.isTaskActive() ? "userTaskBackground-active" : "userTaskBackground-inactive");
            return (
                <div className="bottom_tab_bar">
                    <div className={cssClass}></div>
                    {actionsNodes}
                </div>
            );
        }
    });
    var userActionContainer = React.createClass({
        render: function () {
            return (
                <ActionList actions={userActionList.getActionList()}/>
            )
        }
    });
    return userActionContainer;
});
