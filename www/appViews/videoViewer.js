define(function (require) {
    var store = require("util/store");
    var videoViewer = React.createClass(
        {displayName: "videoViewer",
            render: function () {
                var id = store.getParameterByName("rid");
                var name = store.getParameterByName("rname");
                var url = cordova.file.dataDirectory + "/" + id + "/" + name;
                return (
                    React.createElement("div", {className: "pageContainer"}, 
                        React.createElement("div", {className: "pageTitle"}, name), 
                        React.createElement("div", {className: "viewer"}, 
                            React.createElement("video", {className: "videoScreen", src: url, controls: true}, 
                                React.createElement("source", {src: url, type: 'mp4'}), 
                                "Your phone does not support the video."
                            )
                        )
                    )
                );
            }
        });

    return videoViewer;
});
