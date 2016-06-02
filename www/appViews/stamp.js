define(function (require) {
    var Stamp = React.createClass({displayName: "Stamp",
        render: function () {
            return (
                React.createElement("div", {className: "stampContainer"}, 
                    React.createElement("div", {className: "stamp"}, "ATTESTED")
                )
            );
        }
    });
});