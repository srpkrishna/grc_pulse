define(function (require) {
    var DescriptionAnswer = React.createClass({displayName: "DescriptionAnswer",
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
                    React.createElement("textarea", {className: "qTextArea", onChange: this._onChange, value: text})
                )
            );
        }
    });
    var descriptionAnswerQuestion = React.createClass({displayName: "descriptionAnswerQuestion",
        componentDidMount: function () {
            mixpanel.track("App-On-descriptionAnswerQuestion-Loaded");
        },
        _onAnswerEntered: function (index) {
            this.props.onAnswerSelected(index);
        },
        getSelectedAnswer: function () {
            return this.props.questionnaire.userAnswer;
        },
        render: function () {
            return (
                React.createElement("div", {className: "questionContainer"}, 
                    React.createElement("div", {className: "questionQ"}, this.props.questionnaire.grcpulse_Question__c), 
                    React.createElement(DescriptionAnswer, {onAnswerEntered: this._onAnswerEntered, 
                                       getSelectedAnswer: this.getSelectedAnswer})
                )
            );
        }
    });
    return descriptionAnswerQuestion;
});
