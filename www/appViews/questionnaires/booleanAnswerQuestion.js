define(function (require) {
    var Answer = React.createClass({displayName: "Answer",
        _onClick: function (event) {
            this.props.onAnswerSelected(this.props.answer.Id);
        },
        render: function () {
            var isSelected = this.props.getSelectedAnswer() === this.props.answer.Id ? "radio-active" : "radio-inactive";
            return (
                React.createElement("div", {className: "singleQuestionA", onClick: this._onClick}, 
                    React.createElement("div", {className: isSelected}), 
                    React.createElement("div", null, this.props.answer.grcpulse__Text__c)
                )
            );
        }
    });
    var AnswerList = React.createClass({displayName: "AnswerList",
        render: function () {
            var that = this;
            var answerNode = this.props.answers.map(function (answer, index) {
                return (
                    React.createElement(Answer, {
                        answer: answer, 
                        key: index, 
                        index: index, 
                        onAnswerSelected: that.props.onAnswerSelected, 
                        getSelectedAnswer: that.props.getSelectedAnswer}
                    )
                );
            });
            return (
                React.createElement("div", null, 
                    answerNode
                )
            );
        }
    });
    var booleanAnswerQuestion = React.createClass({displayName: "booleanAnswerQuestion",
        componentDidMount: function () {
            mixpanel.track("App-On-BooleanAnswerQuestion-Loaded");
        },
        _onAnswerSelected: function (id) {
            this.props.onAnswerSelected(id);
        },
        getSelectedAnswer: function () {
            return this.props.questionnaire.userAnswer;
        },
        render: function () {
            return (
                React.createElement("div", {className: "questionContainer"}, 
                    React.createElement("div", {className: "questionQ"}, this.props.questionnaire.grcpulse__Question__c), 
                    React.createElement(AnswerList, {answers: this.props.questionnaire.grcpulse__Question_Options__r.records, onAnswerSelected: this._onAnswerSelected, 
                                getSelectedAnswer: this.getSelectedAnswer})
                )
            );
        }
    });
    return booleanAnswerQuestion;
});
