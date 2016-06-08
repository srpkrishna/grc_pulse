define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");

    function getState() {
        return {
            message: store.getMessage()
        };
    }

    var message = React.createClass({displayName: "message",
        getInitialState: function () {
            return getState();
        },
        _onChange: function (event) {
            var text = event.target.value;
            if (text || text === "") {
                store.setMessage(text);
            }
            this.setState(getState());
        },
        _onClick: function () {
            if (this.state.message !== "" && this.state.message.length > 5) {
                actions.sendCEOMessage();
                mixpanel.track("App-On-DripMessage-Clicked");
            }
        },
        _onMessageSend: function () {
            actions.changeUrl({
                href: -1
            });
            mixpanel.track("App-On-DripMessage-Send");
        },
        componentDidMount: function () {
            store.addCEOMessageSendListener(this._onMessageSend);
            this.textBox = $(this.refs["message"]);
            this.textBox.focus();
            mixpanel.track("App-On-DripMessage-Loaded");
        },
        componentWillUnmount: function () {
            store.removeCEOMessageSendListener(this._onMessageSend);
        },
        render: function () {
            return (
                React.createElement("div", {className: "pageContainer zeroBottom"}, 
                    React.createElement("div", {className: "pageTitle"}, getString("message")), 
                    React.createElement("div", {className: "exceptionDetailsContainer"}, 
                        React.createElement("div", {className: "messageQuote"}), 
                        React.createElement("textarea", {ref: "message", className: "messageTextArea", onChange: this._onChange, 
                                  value: this.state.message, 
                                  placeholder: getString("ceo_message_placeholder")})
                    ), 
                    React.createElement("div", null, 
                        React.createElement("div", {className: "messageSend", onClick: this._onClick}, 
                            React.createElement("div", null, getString("send")), 
                            React.createElement("div", {className: "icon backIcon"})
                        )
                    )
                )
            );
        }
    });
    return message;
});