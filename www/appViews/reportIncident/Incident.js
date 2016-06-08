define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");

    function getState() {
        return {
            incidents: store.getReportedIncidentList()
        }
    }

    var IncidentItem = React.createClass({displayName: "IncidentItem",
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
                React.createElement("div", {className: "incidentReported"}, 
                    "Reported on " + date.getDate() + " " + getString("month_" + date.getMonth()) + " " + date.getFullYear() + " at " + (date.getHours() + 1) + ":" + date.getMinutes() + " " + (date.getHours() > 11 ? "PM" : "AM")
                )
            );
        }
    });
    var IncidentList = React.createClass({displayName: "IncidentList",
        componentDidMount: function () {
            mixpanel.track("App-On-ReportIncident-Incident-List-Loaded");
        },
        render: function () {
            var incidents = this.props.incidents;
            var incidentNode = incidents.map(function (incident, index) {
                return (
                    React.createElement(IncidentItem, {item: incident, key: index})
                );
            });
            return (
                React.createElement("div", {className: "reportedIncidentContainer"}, 
                    incidentNode
                )
            );
        }
    });
    var Incident = React.createClass({displayName: "Incident",
        _goToIncidentQuestionary: function () {
            var goToUrl = "/reportIncident";
            actions.changeUrl({
                href: goToUrl
            });
            mixpanel.track("App-On-ReportIncident-Report-A-Incident");
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
            mixpanel.track("App-On-ReportIncident-Loaded");
        },
        componentWillUnmount: function () {
            store.removeReportedIncidentListAvailableListener(this._onIncidentListAvailable);
        },
        _onIncidentListAvailable: function () {
            this.setState(getState());
        },
        render: function () {
            var incidentList = this.state.incidents.length ? (
                React.createElement(IncidentList, {incidents: this.state.incidents})
            ) : (
                React.createElement("div", {className: "noIncidentsLabel"}, "No Incidents reported by you yet...")
            );
            return (
                React.createElement("div", {className: "exp_container"}, 
                    React.createElement("div", {className: "exp_title"}, 
                        React.createElement("label", {className: "pageTitle"}, getString("incidenttitle"))
                    ), 
                    React.createElement("div", {className: "repIncidentButDiv"}, 
                        React.createElement("div", {className: "repIncidentButton", onClick: this._goToIncidentQuestionary}, 
                            getString("reportanincident")
                        )
                    ), 
                    incidentList
                )
            );
        }
    });
    return Incident;
});
