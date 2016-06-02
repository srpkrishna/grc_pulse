define(function (require) {
    var actions = require("util/actions");
    var store = require("util/store");
    var Back = React.createClass({displayName: "Back",
        _onClick: function (event) {
            actions.changeUrl({
                href: -1
            });
        },
        render: function () {
            return (
                React.createElement("div", {className: "backBtContainer", onClick: this._onClick}, 
                    React.createElement("div", {className: "icon backIcon"})
                )
            );
        }
    });
    return Back;
});
