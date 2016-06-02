define(function (require) {
    var DescriptionAnswer = React.createClass({
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
                <div className="textAreaContainer">
                    <textarea className="qTextArea" onChange={this._onChange} value={text}></textarea>
                </div>
            );
        }
    });
    var descriptionAnswerQuestion = React.createClass({
        _onAnswerEntered: function (index) {
            this.props.onAnswerSelected(index);
        },
        getSelectedAnswer: function () {
            return this.props.questionnaire.userAnswer;
        },
        render: function () {
            return (
                <div className="questionContainer">
                    <div className="questionQ">{this.props.questionnaire.Question__c}</div>
                    <DescriptionAnswer onAnswerEntered={this._onAnswerEntered}
                                       getSelectedAnswer={this.getSelectedAnswer}/>
                </div>
            );
        }
    });
    return descriptionAnswerQuestion;
});