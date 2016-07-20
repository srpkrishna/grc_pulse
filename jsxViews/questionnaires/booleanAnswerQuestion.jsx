define(function (require) {
    var Answer = React.createClass({
        _onClick: function (event) {
            this.props.onAnswerSelected(this.props.answer.Id);
        },
        render: function () {
            var isSelected = this.props.getSelectedAnswer() === this.props.answer.Id ? "radio-active" : "radio-inactive";
            return (
                <div className="singleQuestionA" onClick={this._onClick}>
                    <div className={isSelected}></div>
                    <div>{this.props.answer.grcpulse__Text__c}</div>
                </div>
            );
        }
    });
    var AnswerList = React.createClass({
        render: function () {
            var that = this;
            var answerNode = this.props.answers.map(function (answer, index) {
                return (
                    <Answer
                        answer={answer}
                        key={index}
                        index={index}
                        onAnswerSelected={that.props.onAnswerSelected}
                        getSelectedAnswer={that.props.getSelectedAnswer}
                    />
                );
            });
            return (
                <div>
                    {answerNode}
                </div>
            );
        }
    });
    var booleanAnswerQuestion = React.createClass({
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
                <div className="questionContainer">
                    <div className="questionQ">{this.props.questionnaire.grcpulse__Question__c}</div>
                    <AnswerList answers={this.props.questionnaire.grcpulse__Question_Options__r.records} onAnswerSelected={this._onAnswerSelected}
                                getSelectedAnswer={this.getSelectedAnswer}/>
                </div>
            );
        }
    });
    return booleanAnswerQuestion;
});
