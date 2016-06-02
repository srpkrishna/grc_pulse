define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");

    function getState() {
        return {
            incidents: store.getReportedIncidentList()
        }
    }

    var IncidentItem = React.createClass({
        render: function () {
            var date = new Date(this.props.item);
            /*var message = getString("incident_reported_on", {
                date: date.getDate(),
                month: date.getMonth(),
                year: date.getYear(),
                hour: date.getHours(),
                minute: date.getMinutes()
            });*/
            return (
                <div className="incidentReported">
                    {"Reported on " + date.getDate() + " " + getString("month_" + date.getMonth()) + " " + date.getFullYear() + " at " + (date.getHours() + 1) + ":" + date.getMinutes() + " " + (date.getHours() > 11 ? "PM" : "AM")}
                </div>
            );
        }
    });
    var IncidentList = React.createClass({
        render: function () {
            var incidents = this.props.incidents;
            var incidentNode = incidents.map(function (incident, index) {
                return (
                    <IncidentItem item={incident} key={index}/>
                );
            });
            return (
                <div className="reportedIncidentContainer">
                    {incidentNode}
                </div>
            );
        }
    });
    var Incident = React.createClass({
        _goToIncidentQuestionary: function () {
            var goToUrl = "/reportIncident";
            actions.changeUrl({
                href: goToUrl
            });
        },
        getInitialState: function () {
            return getState();
        },
        componentDidMount: function () {
            store.addReportedIncidentListAvailableListener(this._onIncidentListAvailable);
            var setTimeoutID = setTimeout(function () {
                actions.getReportedIncidentFromDB();
                clearTimeout(setTimeoutID);
            }, 0);
        },
        componentWillUnmount: function () {
            store.removeReportedIncidentListAvailableListener(this._onIncidentListAvailable);
        },
        _onIncidentListAvailable: function () {
            this.setState(getState());
        },
        render: function () {
            var incidentList = this.state.incidents.length ? (
                <IncidentList incidents={this.state.incidents}/>
            ) : (
                <div className="noIncidentsLabel">No Incidents reported by you yet...</div>
            );
            return (
                <div className="exp_container">
                    <div className="exp_title">
                        <label className="pageTitle">{getString("incidenttitle")}</label>
                    </div>
                    <div className="repIncidentButDiv">
                        <div className="repIncidentButton" onClick={this._goToIncidentQuestionary}>
                            {getString("reportanincident")}
                        </div>
                    </div>
                    {incidentList}
                </div>
            );
        }
    });
    return Incident;
});
