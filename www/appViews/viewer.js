define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var Viewer = React.createClass({displayName: "Viewer",
        getContent: function (resource) {
            var url = cordova.file.dataDirectory + "/" + resource.id + "/" + resource.name;
            if (resource.name.indexOf('embed') > -1) {
                return (
                    React.createElement("iframe", {className: "videoScreen", 
                            src: "http://www.youtube.com/embed/MaAngDmdgj0", autoplay: "1", frameborder: "0"}
                    )
                );
            }
            else if (resource.name.indexOf('mp4') > -1) {
                var posterURL = "file:///android_asset/www/css/svg/video%20play.svg";
                return (
                    React.createElement("video", {className: "videoScreen", src: url, controls: true, ref: "videoRef", poster: posterURL, onEnded: this._onVideoEnd, 
                           onPlay: this._onVideoPlay, onLoadedMetadata: this._onLoadedMetadata}, 
                        React.createElement("source", {src: url, type: 'mp4'}), 
                        "Your phone does not support the video."
                    )
                );
            }
            else if (resource.name.indexOf('audio') > -1) {
                return (
                    React.createElement("audio", {controls: true, ref: "audioRef"}, 
                        React.createElement("source", {src: url, type: 'mp4'}), 
                        "Your phone does not support the audio."
                    )
                );
            }
            else if (resource.name.indexOf('pdf') > -1) {
                openViewer(url);
                return (
                    React.createElement("div", {className: "pdfScreen"}
                    )
                );

            }
        },
        _onClick: function (event) {
            if (this.state.isResourceAttested) {
                var policyId = store.getParameterByName("pid");
                var resourceId = store.getParameterByName("rid");
                var updateQuery = "UPDATE resources SET status=1 WHERE resourceid='" + resourceId + "' AND taskid='" + policyId + "'";
                var db = store.getDB();
                db.updateData(updateQuery);
                actions.changeUrl({
                    href: -1
                });
            }
        },
        getInitialState: function () {
            return {
                isResourceAttested: true
            }
        },
        componentDidMount: function () {
            var ref = this.refs["videoRef"];
            if (!ref) {
                ref = this.refs["audioRef"];
            }
            if (ref) {
                this.setState({
                    isResourceAttested: false
                });
            }
        },
        componentWillUnmount: function () {

        },
        _onVideoEnd: function (event) {
            //console.log("On Video Ended");
            this.setState({
                isResourceAttested: true
            });
        },
        _onVideoPlay: function (event) {
            //console.log("On Video Playing");
        },
        _onLoadedMetadata: function (event) {
            var ref = this.refs["videoRef"];
            event.target.onwebkitfullscreenchange = function(ev) {
                //console.log("FULL SCREEN");
            };
        },
        render: function () {
            var policyId = store.getParameterByName("pid");
            var resourceId = store.getParameterByName("rid");
            var policy = store.getTaskDetails(policyId);
            var files = policy.Resources__c || [];
            var resource;
            if (files && (typeof files === "string")) {
                files = $.parseJSON(files);
                for (var i = 0; i < files.length; i++) {
                    if (resourceId === files[i].id) {
                        resource = files[i];
                        break;
                    }
                }
            }
            if (!resource) {
                return;
            }
            var text = "", fileName = "";
            var dotlastIndex = resource.name.lastIndexOf(".");
            if (dotlastIndex > 0) {
                fileName = resource.name.substring(0, dotlastIndex);
            }
            if (resource.name.indexOf("pdf") > -1) {
                text = getString("set_as_completed_pdf");
            }
            else if (resource.name.indexOf("mp4") > -1) {
                text = getString("set_as_completed_mp4");
            }
            var btCSS = (this.state.isResourceAttested ? "attestationBt attestationActive" : "attestationBt");
            return (
                React.createElement("div", {className: "pageContainer"}, 
                    React.createElement("div", {className: "pageTitle"}, policy.Name), 
                    React.createElement("div", {className: "viewerTitle"}, fileName), 
                    React.createElement("div", {className: "viewer"}, 
                        this.getContent(resource)
                    ), 
                    React.createElement("div", {className: "attestationContainer", onClick: this._onClick}, 
                        React.createElement("div", {className: btCSS}, text)
                    )
                )
            );
        }
    });
    return Viewer;
});