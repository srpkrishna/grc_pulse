/**
 * Created by asinha on 19/02/16.
 */
define (function (require){
    var store = require("util/store");
    var actions = require("util/actions");
    var questionType = require("./questionTypes");
    function calculate (questionnaire) {
        var weightage = questionnaire.grcpulse__Weightage__c;
        var userAnswer = questionnaire.userAnswer;
        var score = 0;
        if (userAnswer && (weightage || weightage === 0)) {
            //noinspection JSUnresolvedVariable
            switch (questionnaire.grcpulse__Type__c) {
                case questionType.SINGLE_ANSWER:
                {
                    //noinspection JSUnresolvedVariable
                    var options = questionnaire.Question_Options__r.records;
                    for (var i = 0; i < options.length; i++) {
                        if (userAnswer === options[i].Id) {
                            score = options[i].grcpulse__Score__c * weightage;
                            break;
                        }
                    }
                    break;
                }
                case questionType.MULTIPLE_ANSWER:
                {
                    //noinspection JSUnresolvedVariable
                    var options = questionnaire.Question_Options__r.records;
                    for (var i = 0; i < options.length; i++) {
                        for (var j = 0; j < userAnswer.length; j++) {
                            if (userAnswer[j] === options[i].Id) {
                                score += options[i].grcpulse__Score__c * weightage;
                                break;
                            }
                        }
                    }
                    break;
                }
                case questionType.BOOLEAN_ANSWER:
                {
                    //noinspection JSUnresolvedVariable
                    var options = questionnaire.Question_Options__r.records;
                    for (var i = 0; i < options.length; i++) {
                        if (userAnswer === options[i].Id) {
                            score = options[i].grcpulse__Score__c * weightage;
                            break;
                        }
                    }
                    break;
                }
                case questionType.DESCRIPTION:
                {
                    score = weightage * 1;
                    break;
                }
                case questionType.DATE:
                {
                    score = weightage * 1;
                    break;
                }
                case questionType.NUMBER:
                {
                    score = weightage * 1;
                    break;
                }
            }
        }
        return score;
    }
    function findResult () {
        var totalScore = 0;
        var questionnaires = store.getQuestionnaires();
        for (var i = 0; i < questionnaires.records.length; i++) {
            totalScore += calculate(questionnaires.records[i]);
        }
        return totalScore;
    }
    var CalculateScore = React.createClass ({displayName: "CalculateScore",
        getInitialState: function () {
            return {
                isVisible: false
            };
        },
        componentDidMount: function () {
            store.addDisplayScoreCalculationListener(this._displayScoreCalculation);
        },
        componentWillUnmount: function () {
            store.removeDisplayScoreCalculationListener(this._displayScoreCalculation);
        },
        _displayScoreCalculation: function () {
          this.setState({
              isVisible: true
          });
        },
        _onClick: function () {
            var data = store.getTaskDetails(this.props.taskId);
            var surveys = data.grcpulse__Survey_Details__c || [];
            var minScore = 0;
            if (surveys && (typeof surveys === "string")) {
                surveys = $.parseJSON(surveys);
                for (var i = 0; i < surveys.length; i++) {
                    if (this.props.questionId === surveys[i].id) {
                        minScore = surveys[i].minScore;
                        break;
                    }
                }
            }
            var result = findResult() >= minScore ? true : false;
            this.props.surveyResult(result);
        },
        render: function () {
           var isHiddenCss = "attestationContainer" + (this.state.isVisible ? "" : " visibilityNone");
            var btCSS = (this.state.isVisible ? "attestationBt attestationActive" : "attestationBt");
            return (
                React.createElement("div", {className: isHiddenCss, onClick: this._onClick}, 
                    React.createElement("div", {className: btCSS}, getString("next"))
                )
            );
        }
    });
    return CalculateScore;
});
