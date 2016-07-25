define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var Viewer = React.createClass({
        getContent: function (resource, rURL) {
            var url = cordova.file.dataDirectory + "/" + resource.id + "/" + resource.name;
            if (resource && resource.name.indexOf('embed') > -1) {
                return (
                    <iframe className="videoScreen"
                            src="http://www.youtube.com/embed/MaAngDmdgj0" autoplay="1" frameborder="0">
                    </iframe>
                );
            }
            else if (resource && resource.name.indexOf('mp4') > -1) {
                var posterURL = cordova.file.applicationDirectory + "www/css/svg/video%20play.svg";
                var videoUrl = rURL !== "NA" ? rURL : url;
                return (
                    <video className="videoScreen" src={videoUrl} controls ref="videoRef" poster={posterURL}
                           onEnded={this._onVideoEnd}
                           onPlay={this._onVideoPlay}
                           onLoadedMetadata={this._onLoadedMetadata}
                           onLoadedData={this._onLoadedData}
                           onProgress={this._onProgress}
                           onError={this._onError}
                           onLoadStart={this._onLoadStart}>
                        <source src={videoUrl} type={'mp4'}/>
                        Your phone does not support the video.
                    </video>
                );
            }
            else if (resource && resource.name.indexOf('audio') > -1) {
                return (
                    <audio controls ref="audioRef">
                        <source src={url} type={'mp4'}/>
                        Your phone does not support the audio.
                    </audio>
                );
            }
            else if (resource && resource.name.indexOf('pdf') > -1) {
                if (rURL !== "NA") {
                    rURL = "http://docs.google.com/gview?embedded=true&url="+ rURL;
                    //if (device.platform !== "iOS") {
                        return (
                            <div className="pdfScreen">
                                <iframe frameborder="0" src={rURL}>
                                </iframe>
                            </div>
                        );
                    /*}
                    else {
                        var ref = cordova.InAppBrowser.open (rURL, '_blank', 'location=no,clearcache=yes,zoom=no,toolbar=no,closebuttoncaption=Done');
                        ref.insertCSS({code: "*{-webkit-overflow-scrolling: touch;overflow-scrolling: touch; body: margin-top: 1em !important;}"});
                        return (
                            <div></div>
                        );
                    }*/
                }
                else {
                    openViewer(url);
                    return (
                        <div className="pdfScreen">
                        </div>
                    );
                }
            }
        },
        _onClick: function (event) {
            if (this.state.isResourceAttested) {
                var policyId = store.getParameterByName("pid");
                var resourceId = store.getParameterByName("rid");
                var db = store.getNewDB();
                db.updateResourceStatus(resourceId, policyId, function () {
                    actions.changeUrl({
                        href: -1
                    });
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
        _onError: function (event) {
            console.log(event);
            alert("Empty response from server");
        },
        _onVideoEnd: function (event) {
            //console.log("On Video Ended");
            this.setState({
                isResourceAttested: true
            });
        },
        _onProgress: function () {
            console.log("_onProgress");
        },
        _onLoadedData: function (event) {
            console.log("_onLoadedData");
        },
        _onLoadStart: function (event) {
            console.log("_onLoadStart");
        },
        _onVideoPlay: function (event) {
            console.log("_onVideoPlay");
        },
        _onLoadedMetadata: function (event) {
            //var ref = this.refs["videoRef"];
            console.log("_onLoadedMetadata");
        },
        render: function () {
            console.log("VIEWER RENDER");
            var policyId = store.getParameterByName("pid");
            var resourceId = store.getParameterByName("rid");
            var rURL = store.getParameterByName("rURL");
            var policy = store.getTaskDetails(policyId);
            var files = policy.grcpulse__Resources__c || [];
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
                <div className="pageContainer">
                    <div className="pageTitle">{policy.Name}</div>
                    <div className="viewerTitle">{fileName}</div>
                    <div className="viewer">
                        {this.getContent(resource, rURL)}
                    </div>
                    <div className="attestationContainer" onClick={this._onClick}>
                        <div className={btCSS}>{text}</div>
                    </div>
                </div>
            );
        }
    });
    return Viewer;
});
