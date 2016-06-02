define(function (require) {
    var store = require("util/store");
    var videoViewer = React.createClass(
        {
            render: function () {
                var id = store.getParameterByName("rid");
                var name = store.getParameterByName("rname");
                var url = cordova.file.dataDirectory + "/" + id + "/" + name;
                return (
                    <div className="pageContainer">
                        <div className="pageTitle">{name}</div>
                        <div className="viewer">
                            <video className="videoScreen" src={url} controls>
                                <source src={url} type={'mp4'}/>
                                Your phone does not support the video.
                            </video>
                        </div>
                    </div>
                );
            }
        });

    return videoViewer;
});
