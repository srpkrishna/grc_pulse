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
                    React.createElement("div", null, this.props.answer.Text__c)
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
    var singleAnswerQuestion = React.createClass({displayName: "singleAnswerQuestion",
        _onAnswerSelected: function (index) {
            this.props.onAnswerSelected(index);
        },
        getSelectedAnswer: function () {
            return this.props.questionnaire.userAnswer;
        },
        render: function () {
            return (
                React.createElement("div", {className: "questionContainer"}, 
                    React.createElement("div", {className: "questionQ"}, this.props.questionnaire.Question__c), 
                    React.createElement(AnswerList, {answers: this.props.questionnaire.Question_Options__r.records, onAnswerSelected: this._onAnswerSelected, 
                                getSelectedAnswer: this.getSelectedAnswer})
                )
            );
        }
    });
    return singleAnswerQuestion;
});