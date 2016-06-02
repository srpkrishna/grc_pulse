define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var currentIndex = 0;

    function getState() {
        var questionnaires = store.getQuestionnaires();
        return {
            length: questionnaires ? questionnaires.records.length : 0
        };
    }

    var questionNavigator = React.createClass({
        getInitialState: function () {
            currentIndex = 0;
            return getState();
        },
        componentDidMount: function () {
            store.addDisplayQuestionnaireListener(this._onQuestionDisplay);
        },
        componentWillUnmount: function () {
            store.removeDisplayQuestionnaireListener(this._onQuestionDisplay);
        },
        _onQuestionDisplay: function () {
            this.setState(getState());
            if (currentIndex === (this.state.length -1)) {
                var setTimeOutId  = setTimeout(function(){
                    actions.displayScoreCalculation();
                    clearTimeout(setTimeOutId);
                }, 0);
            }
        },
        _onClick: function (event) {
            var goToIndex = Number(event.currentTarget.getAttribute("data-navigatortype"));
            if (store.getQuestionnaireAnswer(currentIndex) || goToIndex === -1) {
                var newIndex = currentIndex + goToIndex;
                if (newIndex > -1 && newIndex < this.state.length) {
                    currentIndex = newIndex;
                    actions.displayQuestionnaire({
                        questionIndex: currentIndex
                    });
                }
            }
            if (newIndex === (this.state.length -1)) {
                actions.displayScoreCalculation();
            }
        },
        render: function () {
            var textDisplay = this.state.length ? ((currentIndex + 1) + " of " + this.state.length) : "Loading...";
            return (
                <div className="qNavigatorContainer">
                    <div className="icon leftArrow" data-navigatortype="-1" onClick={this._onClick}></div>
                    <div className="qNavigatorText">{textDisplay}</div>
                    <div className="icon rightArrow" data-navigatortype="1" onClick={this._onClick}></div>
                </div>
            );
        }
    });
    return questionNavigator;
});