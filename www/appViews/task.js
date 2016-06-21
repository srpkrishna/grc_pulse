define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var sort = require("util/sort");
    var Resource = React.createClass({displayName: "Resource",
        render: function () {
            var name = this.props.data.name, cssClass = "svgIcon document", fileName = "";
            if (name) {
                var dotlastIndex = name.lastIndexOf(".");
                if (dotlastIndex > 0) {
                    fileName = name.substring(0, dotlastIndex);
                    var fileExt = (name.substring(dotlastIndex + 1, name.length)).toLocaleLowerCase();
                    if (this.props.isSurvey) {
                        cssClass = "svgIcon survey";
                    }
                    else {
                        cssClass = "svgIcon " + (fileExt === "pdf" ? "adobe" : "youtube");
                    }
                }
                else {
                    if (this.props.isSurvey) {
                        cssClass = "svgIcon survey";
                    }
                    fileName = name;
                }
            }
            return (
                React.createElement("div", {className: "taskResources"}, 
                    React.createElement("div", {className: cssClass}), 
                    React.createElement("div", {className: "resourceTitle"}, fileName)
                )
            );
        }
    });
    
    var TaskResourceList = React.createClass({displayName: "TaskResourceList",
        render: function () {
            var resources = this.props.resources, surveys = this.props.surveys, counter = 0;
            var resourceNodes = resources.map(function (resource) {
                return (
                    React.createElement(Resource, {data: resource, key: counter++, isSurvey: false})
                );
            });
            if (surveys && surveys.length > 0) {
                var surveyNode = surveys.map (function (survey) {
                    return (
                        React.createElement(Resource, {data: survey, key: counter++, isSurvey: true})
                    );
                });
                resourceNodes = resourceNodes.concat(surveyNode);
            }
            if (resourceNodes && resourceNodes.length > 1) {
                sort(resourceNodes);
            }
            return (
                React.createElement("div", null, 
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
    
    var Task = React.createClass({displayName: "Task",
        getInitialState: function () {
            return {
                data: store.getTaskDetails(this.props.data.Id)
            };
        },
        _onTaskClick: function (event) {
            this.props.onTaskClick(this.state.data.Id, this.state.data.Type__c);
        },
        componentDidMount: function () {
            if (this.state.data.Type__c === "Public Message") {
                store.addUserInfoFetchListener(this._onUserInfo);
                store.addUserProfileImageListener(this._onUserProfileImage);
                var that = this;
                var setTimeOutId = setTimeout(function () {
                    actions.getCEOMessageUserProfile({
                        taskId: that.state.data.Id,
                        creatorId: that.state.data.CreatedById
                    });
                    clearTimeout(setTimeOutId);
                }, 100);
            }
        },
        componentWillUnmount: function () {
            if (this.state.data.Type__c === "Public Message") {
                store.removeUserInfoFetchListener(this._onUserInfo);
                store.removeUserProfileImageListener(this._onUserProfileImage);
            }
        },
        _onUserInfo: function () {
            this.setState({
                data: store.getTaskDetails(this.props.data.Id)
            });
            var that = this;
            var setTimeOutId = setTimeout(function () {
                if (that.state.data.userInfo) {
                    actions.getCEOMessageUserImage({
                        taskId: that.state.data.Id,
                        url: that.state.data.userInfo.FullPhotoUrl,
                        fileName: that.state.data.userInfo.Name
                    });
                }
                clearTimeout(setTimeOutId);
            }, 100);
        },
        _onUserProfileImage: function () {
            this.setState({
                data: store.getTaskDetails(this.props.data.Id)
            });
        },
        render: function () {
            if (this.state.data.Type__c === "Public Message") {
                var img = this.state.data.userProfileImageURL ? this.state.data.userProfileImageURL : "file:///android_asset/www/css/img/user-default-image.png";
                var titleMessage = this.state.data.userInfo ? getString("ceo_message_title", {userName: this.state.data.userInfo.Name}): "Loading...";
                return (
                    React.createElement("div", {className: "task yellowBackground", onClick: this._onTaskClick}, 
                        React.createElement("div", {className: "messageSenderTitle"}, 
                            React.createElement("img", {src: img, className: "messageSenderImage"}), 
                            React.createElement("span", null, titleMessage)
                        ), 
                        React.createElement("div", {className: "summary"}, 
                            this.state.data.Summary__c
                        )
                    )
                );
            }
            else {
                var files = this.state.data.Resources__c || [];
                if (files && (typeof files === "string")) {
                    files = $.parseJSON(files)
                }
                var surveys = this.state.data.Survey_Details__c || [];
                if (surveys && (typeof surveys === "string")) {
                    surveys = $.parseJSON(surveys)
                }
                this.state.data.packName = "ISMS";
                var endDateText = "", endDateCss = "endDate";
                if(this.state.data.End_Date__c) {
                    var endDateInfo = formatEndDate (this.state.data.End_Date__c);
                    endDateText = endDateInfo.text;
                    endDateCss += (endDateInfo.daysLeft <= 0 ? " endDateAlert" : "");
                }
                return (
                    React.createElement("div", {className: "task", onClick: this._onTaskClick}, 
                        React.createElement("div", {className: "titleContainer"}, 
                            React.createElement("div", {className: "title"}, this.state.data.Name), 
                            React.createElement("div", {className: endDateCss}, endDateText)
                        ), 
                        React.createElement("div", {className: "dept"}, 
                            this.state.data.Department__c
                        ), 
                        React.createElement("div", {className: "summary"}, 
                            this.state.data.Summary__c
                        ), 
                        React.createElement("div", {className: "packContainerInTaskList"}, 
                            React.createElement("div", {className: "packNameInTaskList"}, 
                                this.state.data.packName
                            )
                        ), 
                        React.createElement("div", {className: "resourceList"}, 
                            React.createElement(TaskResourceList, {resources: files, surveys: surveys})
                        )
                    )
                );
            }
        }
    });

    var scrollPosition = 0;
    var TaskList = React.createClass({displayName: "TaskList",
        componentDidMount: function () {
            var taskContainer = $(this.refs["taskContainer"]);
            taskContainer.scrollTop(scrollPosition);
        },
        addEvents: function () {
            var element = document.getElementById("task_list");
            var ha = new Hammer.Manager(element);
            ha.add(new Hammer.Swipe({direction: Hammer.DIRECTION_VERTICAL, threshold: 0}));
            ha.on("swipedown", this._onSwipeDown);
        },
        _onSwipeDown: function () {
            this.props.fetchTask();
        },
        _onScroll: function (event) {
            scrollPosition = event.target.scrollTop;
        },
        render: function () {
            var that = this;
            var tasks = this.props.taskList, counter = 0;

            var taskNodes = tasks.map(function (task) {
                return (
                    React.createElement(Task, {data: task, key: counter++, onTaskClick: that.props.onTaskClick})
                );
            });
            if (tasks.length) {
                return (
                    React.createElement("div", {className: "taskContainer", id: "task_list", onScroll: this._onScroll, ref: "taskContainer"}, 
                        React.createElement("div", {className: "pageTitle"}, getString("task_list")), 
                        taskNodes
                    )
                );
            }
            else {
                return (
                    React.createElement("div", {className: "taskContainer", id: "task_list"}, 
                        React.createElement("div", {className: "pageTitle"}, getString("task_list")), 
                        React.createElement("div", {className: "noTask"}, getString("no_task"))
                    )
                );
            }
        }
    });

    function getState() {
        return {tasks: store.getTasks()};
    }

    var Tasks = React.createClass({displayName: "Tasks",
        getInitialState: function () {
            return getState();
        },
        componentDidMount: function () {
            store.addTaskChangeListener(this._onTaskChange);
            mixpanel.track("App-On-Task-Loaded");
        },
        componentWillUnmount: function () {
            store.removeTaskChangeListener(this._onTaskChange);
        },
        _onTaskChange: function () {
            this.setState(getState());
        },
        _onTaskClick: function (id, type) {
            if (type === "Exception") {
                actions.changeUrl({
                    href: "/taskDetailsExc/" + id
                });
            }
            else {
                actions.changeUrl({
                    href: "/taskDetails/" + id
                });
            }
            mixpanel.track("App-On-Task-Clicked");
        },
        fetchTask: function () {
            actions.checkTask({
                taskTypes: "All",
                emitEvent: true
            });
        },
        render: function () {
            return (
                React.createElement(TaskList, {taskList: this.state.tasks, onTaskClick: this._onTaskClick, fetchTask: this.fetchTask})
            );
        }
    });

    return Tasks;
});
