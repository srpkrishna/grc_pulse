define(function (require) {
    var DateAnswer = React.createClass({displayName: "DateAnswer",
        _onChange: function (event) {
            var text = event.target.value;
            if (text) {
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
                    React.createElement("input", {type: "date", className: "qInputDate", onChange: this._onChange, value: text})
                )
            );
        }
    });
    var dateAnswerQuestion = React.createClass({displayName: "dateAnswerQuestion",
        componentDidMount: function () {
            mixpanel.track("App-On-DateAnswerQuestion-Loaded");
        },
        _onAnswerEntered: function (date) {
            this.props.onAnswerSelected(date);
        },
        getSelectedAnswer: function () {
            return this.props.questionnaire.userAnswer;
        },
        render: function () {
            return (
                React.createElement("div", {className: "questionContainer"}, 
                    React.createElement("div", {className: "questionQ"}, this.props.questionnaire.grcpulse__Question__c), 
                    React.createElement(DateAnswer, {onAnswerEntered: this._onAnswerEntered, 
                                getSelectedAnswer: this.getSelectedAnswer})
                )
            );
        }
    });
    return dateAnswerQuestion;
});
