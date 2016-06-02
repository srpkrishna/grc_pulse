define(function (require) {
    var DateAnswer = React.createClass({
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
                    <input type="number" className="qInputNumber" onChange={this._onChange} value={text}></input>
                </div>
            );
        }
    });
    var dateAnswerQuestion = React.createClass({
        _onAnswerEntered: function (data) {
            this.props.onAnswerSelected(data);
        },
        getSelectedAnswer: function () {
            return this.props.questionnaire.userAnswer;
        },
        render: function () {
            return (
                <div className="questionContainer">
                    <div className="questionQ">{this.props.questionnaire.Question__c}</div>
                    <DateAnswer onAnswerEntered={this._onAnswerEntered}
                                getSelectedAnswer={this.getSelectedAnswer}/>
                </div>
            );
        }
    });
    return dateAnswerQuestion;
});