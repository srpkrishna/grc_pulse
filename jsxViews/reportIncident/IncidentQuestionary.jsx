define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var questions = [{
        question: "Please describe the incident?",
        type: "text",
        answer: ""
    }, {
        question: "Tell us the place of the incident.",
        type: "text",
        answer: ""
    }, {
        question: "Tell us the date & time of the incident.",
        type: "datetime-local",
        answer: ""
    }];
    var currentIndex = 0;
    var Question = React.createClass({
        render: function () {
            var answer = this.props.item.answer;
            var answerNode = answer && answer !== "" ? (
                <div className="bubble_right">{this.props.item.answer}</div>
            ) : null;
            return (
                <div>
                    <div className="bubble_left">{this.props.item.question}</div>
                    {answerNode}
                </div>
            );
        }
    });
    var QuestionnairesList = React.createClass({
        getInitialState: function () {
            return {};
        },
        render: function () {
            var questionnairesNode = questions.map(function (question, index) {
                if (index <= currentIndex) {
                    return (
                        <Question item={question} key={index} index={index}/>
                    );
                }
                else {
                    return null;
                }
            });
            return (
                <div>
                    {questionnairesNode}
                </div>
            );
        }
    });
    var IncidentAnswerInput = React.createClass({
        getInitialState: function () {
            return {};
        },
        componentDidMount: function () {
            this.input  = $(this.refs["incidentInput"]);
            this.submit = $(this.refs["incidentInputSubmit"]);
        },
        _onClick: function () {
            var value = questions[currentIndex].answer;
            if (value && value !== "") {
                currentIndex++;
                if (currentIndex === questions.length) {
                    actions.sendIncidentReported({
                        questions: questions
                    });
                }
                else {
                    this.setState({});
                    this.props.onQuestionnairesSet();
                }
            }
        },
        _onKeyUp: function (event) {
            if(event.code === 13) {
                this._onClick();
            }
        },
        _onChange: function (event) {
            var value = this.input.val();
            if (value && value !== "") {
                this.submit.addClass("reportIncidentInputActive");
            }
            else {
                this.submit.removeClass("reportIncidentInputActive");
            }
            questions[currentIndex].answer = value;
            this.setState({});
        },
        render: function () {
            var that = this;
            var setTimeoutId = setTimeout(function () {
                that.input.focus();
            },0);
            return (
                <div className="reportIncidentInputContainer">
                    <input type={questions[currentIndex].type} onChange={this._onChange} onKeyUp={this._onKeyUp} value={questions[currentIndex].answer} ref="incidentInput"/>
                    <div onClick={this._onClick} ref="incidentInputSubmit">
                        <div>{getString("next")}</div>
                    </div>
                </div>
            );
        }
    });
    var IncidentQuestioners = React.createClass({
        componentDidMount: function () {
            store.addIncidentReportedListener(this._onIncidentReported);
            mixpanel.track("App-On-ReportIncident-Question-Loaded");
        },
        componentWillUnmount: function () {
            store.removeIncidentReportedListener(this._onIncidentReported);
        },
        _onIncidentReported: function () {
            actions.changeUrl({
                href: -1
            });
        },
        _onQuestionnairesSet: function () {
            this.refs["QuestionnairesList"].setState({});
        },
        render: function () {
            currentIndex = 0;
            return (
                <div className="pageContainer">
                    <div className="pageTitle">{getString("reportanincident")}</div>
                    <QuestionnairesList ref="QuestionnairesList"/>
                    <IncidentAnswerInput onQuestionnairesSet={this._onQuestionnairesSet}/>
                </div>
            );
        }
    });
    return IncidentQuestioners;
});
