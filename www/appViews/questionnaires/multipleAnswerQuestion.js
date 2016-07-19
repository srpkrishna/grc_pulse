define(function (require) {
    var Answer = React.createClass({displayName: "Answer",
        _onClick: function (event) {
            this.props.onAnswerSelected(this.props.answer.Id);
        },
        render: function () {
            var isSelected = this.props.isSelectedAnswer(this.props.answer.Id) ? "radio-multi-active" : "radio-inactive";
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
                        isSelectedAnswer: that.props.isSelectedAnswer}
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
    var multipleAnswerQuestions = React.createClass({displayName: "multipleAnswerQuestions",
        componentDidMount: function () {
            mixpanel.track("App-On-MultipleAnswerQuestions-Loaded");
        },
        _onAnswerSelected: function (index) {
            var answers = this.props.questionnaire.userAnswer;
            if (!answers) {
                answers = [];
            }
            var answerIndex = answers.indexOf(index);
            if (answerIndex === -1) {
                answers.push(index);
            }
            else {
                answers.splice(answerIndex, 1);
            }
            this.props.onAnswerSelected(answers);
        },
        isSelectedAnswer: function (index) {
            var isSelected = false;
            if (this.props.questionnaire.userAnswer) {
                isSelected = this.props.questionnaire.userAnswer.indexOf(index) === -1 ? false : true;
            }
            return isSelected;
        },
        render: function () {
            return (
                React.createElement("div", {className: "questionContainer"}, 
                    React.createElement("div", {className: "questionQ"}, this.props.questionnaire.grcpulse__Question__c), 
                    React.createElement(AnswerList, {answers: this.props.questionnaire.Question_Options__r.records, onAnswerSelected: this._onAnswerSelected, 
                                isSelectedAnswer: this.isSelectedAnswer})
                )
            );
        }
    });
    return multipleAnswerQuestions;
});
