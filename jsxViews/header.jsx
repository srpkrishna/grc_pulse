define(function () {
    var header = React.createClass({
        displayName: 'PageHeader',
        render: function () {
            return (
                <div className="headerContainer" data-l10n-id="appName">
                    <div className="appName">
                        {getString("appName")}
                    </div>
                </div>
            );
        }
    });
    return header;
});