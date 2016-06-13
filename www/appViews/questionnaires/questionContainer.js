define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var QuestionNavigator = require("./questionNavigator");
    var Question = require("./question");
    var setTimeoutIdGlobal = null;
    function getState() {
        return {
            questionnaires: store.getQuestionnaires(),
            questionnaireIndex: store.getDisplayQuestionnaireIndex(),
            isPass: "resultPending"
        };
    }

    var container = React.createClass({displayName: "container",
        getInitialState: function () {
            return getState();
        },
        componentDidMount: function () {
            store.addQuestionnairesFetchedListener(this._onQuestionFetched);
            var that = this;
            var setTimeOutId = setTimeout(function () {
                actions.getQuestionnaires({
                    taskId: that.props.taskId,
                    questionnaireId: that.props.questionId
                });
                clearTimeout(setTimeOutId);
            }, 0);
            mixpanel.track("App-On-Questionnaires-Loaded");
        },
        componentWillUnmount: function () {
            store.removeQuestionnairesFetchedListener(this._onQuestionFetched);

        },
        _onQuestionFetched: function () {
            var that = this;
            var setTimeOutId = setTimeout(function () {
                actions.displayQuestionnaire({
                    questionIndex: 0
                });
                clearTimeout(setTimeOutId);
            }, 0);
        },
        _onSurveyResultIsPass: function () {
            actions.changeUrl({
                href: "/taskDetails/" + this.props.taskId
            });
        },
        _onSurveyResultIsFail: function () {
            this.cleanTimeOutGlobal();
            var that = this;
            this.setState ({
                questionnaires: store.getQuestionnaires(),
                questionnaireIndex: store.getDisplayQuestionnaireIndex(),
                isPass: "resultPending"
            });
            var setTimeOutId = setTimeout(function () {
                actions.getQuestionnaires({
                    taskId: that.props.taskId,
                    questionnaireId: that.props.questionId
                });
                clearTimeout(setTimeOutId);
            }, 0);
        },
        _onSurveyResults: function (isPass) {
            if(isPass) {
                var db = store.getNewDB();
                db.updateResourceStatus(this.props.questionId, this.props.taskId);
            }
            var that = this;
            setTimeoutIdGlobal = setTimeout(function() {
                if (isPass) {
                    that._onSurveyResultIsPass();
                }
                else {
                    that._onSurveyResultIsFail();
                }
                that.cleanTimeOutGlobal();
            }, 10000000000);
            this.setState ({
                questionnaires: store.getQuestionnaires(),
                questionnaireIndex: store.getDisplayQuestionnaireIndex(),
                isPass: isPass
            });
        },
        cleanTimeOutGlobal: function () {
            if(setTimeoutIdGlobal) {
                clearTimeout(setTimeoutIdGlobal);
                setTimeoutIdGlobal = null;
            }
        },
        render: function () {
            var content = null;
            if (this.state.isPass === "resultPending") {
                content = (
                    React.createElement("div", null, 
                        React.createElement(QuestionNavigator, null), 
                        React.createElement(Question, {taskId: this.props.taskId, questionId: this.props.questionId, surveyResults: this._onSurveyResults})
                    )
                );
            }
            else if (this.state.isPass) {
                content = (
                    React.createElement("div", null, 
                        React.createElement("div", {className: "resultIconContainer pass"}), 
                        React.createElement("div", {className: "resultTextContainer passText"}), 
                        React.createElement("div", {className: "attestationContainer", onClick: this._onSurveyResultIsPass}, 
                            React.createElement("div", {className: "attestationBt attestationActive"}, getString("survey_pass_bt_text"))
                        )
                    )
                );
            }
            else if (!this.state.isPass) {
                content = (
                    React.createElement("div", null, 
                        React.createElement("div", {className: "resultIconContainer fail"}), 
                        React.createElement("div", {className: "resultTextContainer failText"}), 
                        React.createElement("div", {className: "attestationContainer", onClick: this._onSurveyResultIsFail}, 
                            React.createElement("div", {className: "attestationBt attestationActive"}, getString("survey_fail_bt_text"))
                        )
                    )
                );
            }
            var surveyName = "";
            var data = store.getTaskDetails(this.props.taskId);
            var surveys = data.Survey_Details__c || [];
            if (surveys && (typeof surveys === "string")) {
                surveys = $.parseJSON(surveys);
                for (var i = 0; i < surveys.length; i++) {
                    if (this.props.questionId === surveys[i].id) {
                        surveyName = surveys[i].name;
                        break;
                    }
                }
            }
            return (
                React.createElement("div", {className: "pageContainer zeroBottom"}, 
                    React.createElement("div", {className: "pageTitle"}, surveyName), 
                    content
                )
            );
        }
    });
    return container;
});