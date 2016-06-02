define(function (require) {
    var actions = require("util/actions");
    var store = require("util/store");
    var Back = React.createClass({
        _onClick: function (event) {
            actions.changeUrl({
                href: -1
            });
        },
        render: function () {
            return (
                <div className="backBtContainer" onClick={this._onClick}>
                    <div className="icon backIcon"></div>
                </div>
            );
        }
    });
    return Back;
});
