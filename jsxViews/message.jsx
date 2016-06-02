define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");

    function getState() {
        return {
            message: store.getMessage()
        };
    }

    var message = React.createClass({
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
            }
        },
        _onMessageSend: function () {
            actions.changeUrl({
                href: -1
            });
        },
        componentDidMount: function () {
            store.addCEOMessageSendListener(this._onMessageSend);
            this.textBox = $(this.refs["message"]);
            this.textBox.focus();
        },
        componentWillUnmount: function () {
            store.removeCEOMessageSendListener(this._onMessageSend);
        },
        render: function () {
            return (
                <div className="pageContainer zeroBottom">
                    <div className="pageTitle">{getString("message")}</div>
                    <div className="exceptionDetailsContainer">
                        <div className="messageQuote"></div>
                        <textarea ref="message" className="messageTextArea" onChange={this._onChange}
                                  value={this.state.message}
                                  placeholder={getString("ceo_message_placeholder")}></textarea>
                    </div>
                    <div>
                        <div className="messageSend" onClick={this._onClick}>
                            <div>{getString("send")}</div>
                            <div className="icon backIcon"></div>
                        </div>
                    </div>
                </div>
            );
        }
    });
    return message;
});