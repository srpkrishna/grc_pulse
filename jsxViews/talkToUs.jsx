define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    return React.createClass({
        _onClick: function () {
            var comment = this.refs["comment"].value;
            if (comment && comment.length) {
                $.ajax({
                    type: "POST",
                    url: "https://hooks.slack.com/services/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",
                    data: JSON.stringify({"username": store.getUserInfo().Name, text: comment}),
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        if (data === "ok") {
                            window.plugins.toast.showWithOptions(
                                {
                                    message: "Message Sucessfully Posted",
                                    duration: "long",
                                    position: "top",
                                    addPixelsY: -40
                                },
                                function () {
                                    actions.changeUrl({
                                        href: -1
                                    });
                                },
                                function () {

                                });
                        }
                    },
                    error: function (data) {
                        //console.error(data);
                    }
                });
            }
        },
        render: function () {
            return (
                <div className="pageContainer">
                    <div className="pageTitle">Talk To Us...!</div>
                    <textarea ref="comment" className="talkToUsTextArea"
                              placeholder="Love or hate something about GRC Pulse...?"></textarea>
                    <div className="attestationContainer" onClick={this._onClick}>
                        <div className="attestationBt attestationActive">Send</div>
                    </div>
                </div>
            );
        }
    });
});