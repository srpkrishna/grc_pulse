define(function (require) {
    var DateAnswer = React.createClass({displayName: "DateAnswer",
        _onChange: function (event) {
            var text = event.target.value;
            if (text || text === "") {
                this.props.onAnswerEntered(text);
            }
        },
        componentDidMount: function () {
            $("textarea").focus();
        },
        render: function () {
            var text = this.props.getSelectedAnswer();
            if (!text) {
                text = "";
            }
            return (
                React.createElement("div", {className: "textAreaContainer"}, 
                    React.createElement("input", {type: "number", className: "qInputNumber", onChange: this._onChange, value: text})
                )
            );
        }
    });
    var numberAnswerQuestion = React.createClass({displayName: "numberAnswerQuestion",
        componentDidMount: function () {
            mixpanel.track("App-On-NumberAnswerQuestion-Loaded");
        },
        _onAnswerEntered: function (data) {
            this.props.onAnswerSelected(data);
        },
        getSelectedAnswer: function () {
            return this.props.questionnaire.userAnswer;
        },
        render: function () {
            return (
                React.createElement("div", {className: "questionContainer"}, 
                    React.createElement("div", {className: "questionQ"}, this.props.questionnaire.grcpulse_Question__c), 
                    React.createElement(DateAnswer, {onAnswerEntered: this._onAnswerEntered, 
                                getSelectedAnswer: this.getSelectedAnswer})
                )
            );
        }
    });
    return numberAnswerQuestion;
});
