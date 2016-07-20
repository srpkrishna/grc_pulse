define(function (require) {
    var store = require("util/store");
    var questionType = require("./questionTypes");
    var SingleAnswerQuestion = require("./singleAnswerQuestion");
    var MultipleAnswerQuestion = require("./multipleAnswerQuestion");
    var BooleanAnswerQuestion = require("./booleanAnswerQuestion");
    var DescriptionAnswerQuestion = require("./descriptionAnswerQuestion");
    var DateAnswerQuestion = require("./dateAnswerQuestion");
    var NumberAnswerQuestion = require("./numberAnswerQuestion");
    var ScoreCalculation = require("./calculateScore");
    function getState() {
        return {
            questionnaires: store.getQuestionnaires(),
            questionnaireIndex: store.getDisplayQuestionnaireIndex()
        };
    }

    var question = React.createClass({displayName: "question",
        getInitialState: function () {
            return getState();
        },
        componentDidMount: function () {
            store.addDisplayQuestionnaireListener(this._displayQuestion);
        },
        componentWillUnmount: function () {
            store.removeDisplayQuestionnaireListener(this._displayQuestion);
        },
        _displayQuestion: function () {
            this.setState(getState());
        },
        _onAnswerSelected: function (data) {
            store.setQuestionnaireAnswer(this.state.questionnaireIndex, data);
            this.setState(getState());
        },
        getContent: function (questionnaire) {
            //noinspection JSUnresolvedVariable
            switch (questionnaire.grcpulse__Type__c) {
                case questionType.SINGLE_ANSWER:
                {
                    return (
                        React.createElement(SingleAnswerQuestion, {questionnaire: questionnaire, onAnswerSelected: this._onAnswerSelected})
                    );
                    break;
                }
                case questionType.MULTIPLE_ANSWER:
                {
                    return (
                        React.createElement(MultipleAnswerQuestion, {questionnaire: questionnaire, 
                                                onAnswerSelected: this._onAnswerSelected})
                    );
                    break;
                }
                case questionType.BOOLEAN_ANSWER:
                {
                    return (
                        React.createElement(BooleanAnswerQuestion, {questionnaire: questionnaire, onAnswerSelected: this._onAnswerSelected})
                    );
                    break;
                }
                case questionType.DESCRIPTION:
                {
                    return (
                        React.createElement(DescriptionAnswerQuestion, {questionnaire: questionnaire, 
                                                   onAnswerSelected: this._onAnswerSelected})
                    );
                    break;
                }
                case questionType.DATE:
                {
                    return (
                        React.createElement(DateAnswerQuestion, {questionnaire: questionnaire, onAnswerSelected: this._onAnswerSelected})
                    );
                    break;
                }
                case questionType.NUMBER:
                {
                    return (
                        React.createElement(NumberAnswerQuestion, {questionnaire: questionnaire, onAnswerSelected: this._onAnswerSelected})
                    );
                    break;
                }
            }
        },
        render: function () {
            var content = null;
            if (this.state.questionnaireIndex > -1 && this.state.questionnaires) {
                var questionnaire = this.state.questionnaires.records[this.state.questionnaireIndex];
                content = this.getContent(questionnaire);
            }
            return (
                React.createElement("div", null, 
                    React.createElement("div", null, content), 
                    React.createElement(ScoreCalculation, {surveyResult: this.props.surveyResults, taskId: this.props.taskId, questionId: this.props.questionId})
                )
            );
        }
    });
    return question;
});
