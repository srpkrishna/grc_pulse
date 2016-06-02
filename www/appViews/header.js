define(function () {
    var header = React.createClass({
        displayName: 'PageHeader',
        render: function () {
            return (
                React.createElement("div", {className: "headerContainer", "data-l10n-id": "appName"}, 
                    React.createElement("div", {className: "appName"}, 
                        getString("appName")
                    )
                )
            );
        }
    });
    return header;
});