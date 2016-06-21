define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var Attestation = require("./attestation");
    var notes = require("util/serverData/getNotes");
    var db = store.getNewDB();
    var sort = require("util/sort");
    var Resource = React.createClass({
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
            mixpanel.track("App-On-TaskDetails-Resource-Fetched");
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
            db.getResourcesByIdAndTaskId(this.props.data.id, this.props.taskId, function (response) {
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
            mixpanel.track("App-On-TaskDetails-Resource-Clicked");
        },
        componentDidMount: function () {
            this.query();
            mixpanel.track("App-On-TaskDetails-Resource-Loaded");
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
                    <div onClick={this._onClick}>
                        <div className={cssSteps}></div>
                        <div className={iconCSS}></div>
                        <div className="resourceName">
                            {name}
                        </div>
                    </div>
                );
            }
            else {
                var connectorStyle = "resourceStepConnentor " + (this.state.isActive ? "resourceActiveStepConnentor" : "resourceInactiveStepConnentor");
                return (
                    <div onClick={this._onClick}>
                        <div className="resourceConnectorContainer">
                            <div className={connectorStyle}></div>
                            <div className={connectorStyle}></div>
                            <div className={cssSteps}></div>
                        </div>
                        <div className={iconCSS}></div>
                        <div className="resourceName">
                            {name}
                        </div>
                    </div>
                );
            }
        }
    });

    var TaskResourceList = React.createClass({
        render: function () {
            var taskId = this.props.taskId;
            var counter = -1;
            var resources = this.props.resources;
            var surveys = this.props.surveys;
            var resourceObj = [];
            for (var i = 0; i < resources.length; i++) {
                var resource = resources[i];
                resource.isSurvey = false;
                resourceObj.push(resource);
            }
            for (var j = 0; j < surveys.length; j++) {
                var survey = surveys[j];
                var questionData = {id: survey.id, name: survey.name, type: "q", isSurvey: true, seqNo: survey.seqNo};
                resourceObj.push(questionData);
            }
            resourceObj = sort(resourceObj);
            var resourceNodes = resourceObj.map(function (resource) {
                counter++;
                return (
                    <Resource data={resource} taskId={taskId} key={counter} counter={counter} isSurvey={resource.isSurvey}/>
                );
            });
            return (
                <div className="resourceContainer">
                    {resourceNodes}
                </div>
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
    var TaskDetails = React.createClass({
        componentDidMount: function () {
            mixpanel.track("App-On-TaskDetails-Loaded");
        },
        render: function () {
            var taskId = this.props.taskId;
            var data = store.getTaskDetails(this.props.taskId);
            if (data.Type__c === "Public Message") {
                return (
                    <div className="taskDetailsContainer yellowBackground">
                        <div className="pageTitle">{getString("task_details")}</div>
                        <div className="textCenter">
                            <img src={data.userProfileImageURL} className="messageSenderImage"/>
                        </div>
                        <div className="titleContainer textCenter">
                            <div className="title">{getString("ceo_message_title", {userName: data.userInfo.Name})}</div>
                        </div>
                        <div className="summaryTaskDetails messageSummary">{data.Summary__c}</div>
                        <Attestation taskId={taskId} isMessage="true" />
                    </div>
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
                    <div className="taskDetailsContainer">
                        <div className="pageTitle">{getString("task_details")}</div>
                        <div className="packContainerInTaskList">
                            {data.packName ? (
                                <div className="packNameInTaskList">
                                    {data.packName}
                                </div>
                            ) : null}
                        </div>
                        <div className="titleContainer">
                            <div className="title">{data.Name}</div>
                            <div className={endDateCss}>{endDateText}</div>
                        </div>
                        <div className="deptTaskDetail">
                            {data.Department__c}
                        </div>
                        <div className="summaryTaskDetails">{data.Summary__c}</div>
                        <TaskResourceList resources={files} taskId={taskId} surveys={surveys}/>
                        <Attestation taskId={taskId}/>
                    </div>
                );
            }
        }
    });
    return TaskDetails;
});
