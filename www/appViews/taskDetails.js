define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var Attestation = require("./attestation");
    var notes = require("util/serverData/getNotes");
    var db = store.getDB();
    var Resource = React.createClass({displayName: "Resource",
        getInitialState: function () {
            return {
                isSelected: false,
                isActive: false
            };
        },
        openViewer: function () {
            var qParams = "rid=" + this.props.data.id + "&" + "pid=" + this.props.taskId;
            var goToUrl = "/viewer?" + encodeURI(qParams);
            actions.changeUrl({
                href: goToUrl
            });
        },
        downloadResource: function () {
            var that = this;
            notes.getNoteFromId(this.props.data.id,
                function (data) {
                    var note;

                    if (data.records && data.totalSize > 0) {
                        note = data.records[0];
                    } else {
                        note = {
                            Id: that.props.data.id,
                            Title: that.props.data.name
                        }
                    }

                    store.getResource(note, that.openViewer);
                }
            );
        },
        query: function () {
            var that = this;
            var params = [{
                resourceid: this.props.data.id,
                taskid: this.props.taskId
            }];
            db.getDataFromTable("resources", params, function (response) {
                if (response && response.length === 1) {
                    var isActive = response.item(0).status ? true : false;
                    that._onDBCallback(isActive);
                }
            });
        },
        _onDBCallback: function (status) {
            this.setState({
                isSelected: this.state.isSelected,
                isActive: status
            });
        },
        _onClick: function (event) {
            if (this.props.data.type === "q") {
                actions.changeUrl({
                    href: "/questions/" + this.props.taskId + "/" + this.props.data.id
                });
            }
            else {
                $(event.target).parent().siblings().css("background-color", "white");
                $(event.target).parent().css("background-color", "LightGray");
                var name = this.props.data.name;
                if (name && (name.indexOf("pdf") > -1 || name.indexOf("mp4") > -1 )) {
                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "/" + this.props.data.id + "/" + name, this.openViewer, this.downloadResource);
                }
                else {
                    alert(getString("error_contentType_notsupported"))
                }
            }
        },
        componentDidMount: function () {
            this.query();
        },
        componentWillUnmount: function () {

        },
        render: function () {
            var cssSteps = "resourceStep " + (this.state.isActive ? "resourceActiveStep" : "resourceInActiveStep");
            var name = this.props.data.name, iconCSS = "svgIcon document iconPadding";
            if (name) {
                var dotlastIndex = name.lastIndexOf(".");
                if (dotlastIndex > 0) {
                    var fileExt = (name.substring(dotlastIndex + 1, name.length)).toLocaleLowerCase();
                    iconCSS = "svgIcon " + (fileExt === "pdf" ? "adobe" : "youtube") + " iconPadding";
                }
                if (this.props.isSurvey) {
                    iconCSS = "svgIcon survey iconPadding";
                }
            }
            if (!this.props.counter) {
                return (
                    React.createElement("div", {onClick: this._onClick}, 
                        React.createElement("div", {className: cssSteps}), 
                        React.createElement("div", {className: iconCSS}), 
                        React.createElement("div", {className: "resourceName"}, 
                            name
                        )
                    )
                );
            }
            else {
                var connectorStyle = "resourceStepConnentor " + (this.state.isActive ? "resourceActiveStepConnentor" : "resourceInactiveStepConnentor");
                return (
                    React.createElement("div", {onClick: this._onClick}, 
                        React.createElement("div", {className: "resourceConnectorContainer"}, 
                            React.createElement("div", {className: connectorStyle}), 
                            React.createElement("div", {className: connectorStyle}), 
                            React.createElement("div", {className: cssSteps})
                        ), 
                        React.createElement("div", {className: iconCSS}), 
                        React.createElement("div", {className: "resourceName"}, 
                            name
                        )
                    )
                );
            }
        }
    });

    var TaskResourceList = React.createClass({displayName: "TaskResourceList",
        render: function () {
            var resources = this.props.resources;
            var taskId = this.props.taskId;
            var counter = -1;
            var resourceNodes = resources.map(function (resource) {
                counter++;
                return (
                    React.createElement(Resource, {data: resource, taskId: taskId, key: counter, counter: counter, isSurvey: false})
                );
            });
            if (this.props.surveys && this.props.surveys.length > 0) {
                var surveys = this.props.surveys;
                var surveyNode = surveys.map(function(survey){
                    counter++;
                    var questionData = {id: survey.id, name: survey.name, type: "q"};
                    return (
                        React.createElement(Resource, {data: questionData, taskId: taskId, key: counter, counter: counter, isSurvey: true})
                    );
                });
                resourceNodes = resourceNodes.concat(surveyNode);
            }
            return (
                React.createElement("div", {className: "resourceContainer"}, 
                    resourceNodes
                )
            );
        }
    });
    function formatEndDate (endDate) {
        var endDate = new Date(endDate);
        var daysLeft = "";
        if (endDate) {
            daysLeft = parseInt((endDate - Date.now()) / 86400000);
        }
        return {daysLeft: daysLeft, text : daysLeft + "d"};
    }
    var TaskDetails = React.createClass({displayName: "TaskDetails",
        _onClick: function (event) {
            
        },
        render: function () {
            var taskId = this.props.taskId;
            var data = store.getTaskDetails(this.props.taskId);
            if (data.Type__c === "Public Message") {
                return (
                    React.createElement("div", {className: "taskDetailsContainer yellowBackground"}, 
                        React.createElement("div", {className: "pageTitle"}, getString("task_details")), 
                        React.createElement("div", {className: "textCenter"}, 
                            React.createElement("img", {src: data.userProfileImageURL, className: "messageSenderImage"})
                        ), 
                        React.createElement("div", {className: "titleContainer textCenter"}, 
                            React.createElement("div", {className: "title"}, getString("ceo_message_title", {userName: data.userInfo.Name}))
                        ), 
                        React.createElement("div", {className: "summaryTaskDetails messageSummary"}, data.Summary__c), 
                        React.createElement(Attestation, {taskId: taskId, isMessage: "true"})
                    )
                );
            }
            else {
                var files = data.Resources__c || [];
                if (files && (typeof files === "string")) {
                    files = $.parseJSON(files);
                }
                var surveys = data.Survey_Details__c || [];
                if (surveys && (typeof surveys === "string")) {
                    surveys = $.parseJSON(surveys);
                }
                var endDateText = "", endDateCss = "endDate";
                if(data.End_Date__c) {
                    var endDateInfo = formatEndDate (data.End_Date__c);
                    endDateText = endDateInfo.text;
                    endDateCss += (endDateInfo.daysLeft <= 0 ? " endDateAlert" : "");
                }
                return (
                    React.createElement("div", {className: "taskDetailsContainer"}, 
                        React.createElement("div", {className: "pageTitle"}, getString("task_details")), 
                        React.createElement("div", {className: "packContainerInTaskList"}, 
                            data.packName ? (
                                React.createElement("div", {className: "packNameInTaskList"}, 
                                    data.packName
                                )
                            ) : null
                        ), 
                        React.createElement("div", {className: "titleContainer"}, 
                            React.createElement("div", {className: "title"}, data.Name), 
                            React.createElement("div", {className: endDateCss}, endDateText)
                        ), 
                        React.createElement("div", {className: "deptTaskDetail"}, 
                            data.Department__c
                        ), 
                        React.createElement("div", {className: "summaryTaskDetails"}, data.Summary__c), 
                        React.createElement(TaskResourceList, {resources: files, taskId: taskId, surveys: surveys}), 
                        React.createElement(Attestation, {taskId: taskId})
                    )
                );
            }
        }
    });
    return TaskDetails;
});
