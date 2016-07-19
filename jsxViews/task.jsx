define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var sort = require("util/sort");
    var Resource = React.createClass({
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
                <div className="taskResources">
                    <div className={cssClass}></div>
                    <div className="resourceTitle">{fileName}</div>
                </div>
            );
        }
    });

    var TaskResourceList = React.createClass({
        render: function () {
            var resources = this.props.resources, surveys = this.props.surveys, counter = 0;
            var resourceNodes = resources.map(function (resource) {
                return (
                    <Resource data={resource} key={counter++} isSurvey={false}/>
                );
            });
            if (surveys && surveys.length > 0) {
                var surveyNode = surveys.map (function (survey) {
                    return (
                        <Resource data={survey} key={counter++} isSurvey={true}/>
                    );
                });
                resourceNodes = resourceNodes.concat(surveyNode);
            }
            if (resourceNodes && resourceNodes.length > 1) {
                sort(resourceNodes);
            }
            return (
                <div>
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

    var Task = React.createClass({
        getInitialState: function () {
            return {
                data: store.getTaskDetails(this.props.data.Id)
            };
        },
        _onTaskClick: function (event) {
            this.props.onTaskClick(this.state.data.Id, this.state.data.grcpulse__Type__c);
        },
        componentDidMount: function () {
            if (this.state.data.grcpulse__Type__c === "Public Message") {
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
            if (this.state.data.grcpulse__Type__c === "Public Message") {
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
            if (this.state.data.grcpulse__grcpulse__Type__c === "Public Message") {
                var img = this.state.data.userProfileImageURL ? this.state.data.userProfileImageURL : "file:///android_asset/www/css/img/user-default-image.png";
                var titleMessage = this.state.data.userInfo ? getString("ceo_message_title", {userName: this.state.data.userInfo.Name}): "Loading...";
                return (
                    <div className="task yellowBackground" onClick={this._onTaskClick}>
                        <div className="messageSenderTitle">
                            <img src={img} className="messageSenderImage"/>
                            <span>{titleMessage}</span>
                        </div>
                        <div className="summary">
                            {this.state.data.grcpulse__Summary__c}
                        </div>
                    </div>
                );
            }
            else {
                var files = this.state.data.grcpulse__Resources__c || [];
                if (files && (typeof files === "string")) {
                    files = $.parseJSON(files)
                }
                var surveys = this.state.data.grcpulse__Survey_Details__c || [];
                if (surveys && (typeof surveys === "string")) {
                    surveys = $.parseJSON(surveys)
                }
                this.state.data.packName = "ISMS";
                var endDateText = "", endDateCss = "endDate";
                if(this.state.data.grcpulse__End_Date__c) {
                    var endDateInfo = formatEndDate (this.state.data.grcpulse__End_Date__c);
                    endDateText = endDateInfo.text;
                    endDateCss += (endDateInfo.daysLeft <= 0 ? " endDateAlert" : "");
                }
                return (
                    <div className="task" onClick={this._onTaskClick}>
                        <div className="titleContainer">
                            <div className="title">{this.state.data.Name}</div>
                            <div className={endDateCss}>{endDateText}</div>
                        </div>
                        <div className="dept">
                            {this.state.data.grcpulse__Department__c}
                        </div>
                        <div className="summary">
                            {this.state.data.grcpulse__Summary__c}
                        </div>
                        <div className="packContainerInTaskList">
                            <div className="packNameInTaskList">
                                {this.state.data.packName}
                            </div>
                        </div>
                        <div className="resourceList">
                            <TaskResourceList resources={files} surveys={surveys}/>
                        </div>
                    </div>
                );
            }
        }
    });

    var scrollPosition = 0;
    var TaskList = React.createClass({
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
                    <Task data={task} key={counter++} onTaskClick={that.props.onTaskClick}/>
                );
            });
            if (tasks.length) {
                return (
                    <div className="taskContainer" id={"task_list"} onScroll={this._onScroll} ref="taskContainer">
                        <div className="pageTitle">{getString("task_list")}</div>
                        {taskNodes}
                    </div>
                );
            }
            else {
                return (
                    <div className="taskContainer" id={"task_list"}>
                        <div className="pageTitle">{getString("task_list")}</div>
                        <div className="noTask">{getString("no_task")}</div>
                    </div>
                );
            }
        }
    });

    function getState() {
        return {tasks: store.getTasks()};
    }

    var Tasks = React.createClass({
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
                <TaskList taskList={this.state.tasks} onTaskClick={this._onTaskClick} fetchTask={this.fetchTask}/>
            );
        }
    });

    return Tasks;
});
