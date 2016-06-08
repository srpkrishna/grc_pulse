define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var policyDetails = React.createClass(
        {
            handleClick: function (i) {
                var note = this.state.policyContents[i];
                if (note.Title && (note.Title.indexOf("pdf") > -1 || note.Title.indexOf("mp4") > -1)) {
                    store.getResource(note,
                        function (entry) {
                            if (note.Title && note.Title.indexOf("pdf") > -1)
                                openViewer(cordova.file.dataDirectory + entry.fullPath);
                            else {
                                var qParams = "rid=" + note.Id + "&" + "rname=" + note.Title;
                                var goToUrl = "/videoViewer?" + encodeURI(qParams);
                                actions.changeUrl({
                                    href: goToUrl
                                });
                            }
                        });
                } else {
                    alert("Resource of this type can't be viewed");
                }
                mixpanel.track("App-On-PolicyDetails-Clicked");
            },
            getInitialState: function () {
                return {policyContents: []}
            },
            getContents: function (contents) {
                var that = this;
                var policyContents = contents.map(function (content, i) {
                    var fileName = cordova.file.applicationDirectory + "www/css/svg/" + "active%20step%20connector.svg";
                    return (

                        <div className="policyContent" key={i} onClick={that.handleClick.bind(that, i)}>
                            <img className="noteSymb" src={fileName}/>
                            <div className="noteName">{content.Title}</div>
                        </div>
                    );
                });

                return policyContents;
            },
            componentDidMount: function () {
                var that = this;
                var policyId = store.getParameterByName("pid");

                var notes = require("util/serverData/getNotes");
                notes.getNotesFromPolicyId(policyId,
                    function (data) {
                        that.setState({
                            policyContents: data.records
                        });
                    }
                );
                mixpanel.track("App-On-PolicyDetails-Load");
            },
            render: function () {
                var policyName = store.getParameterByName("pname");
                var policyDesc = store.getParameterByName("pdesc");
                if (!policyDesc || policyDesc === "null") {
                    policyDesc = "";
                }

                var contents = this.getContents(this.state.policyContents);
                return (
                    <div className="container">
                        <div className="pageTitle">{getString("grc_policy_details")}</div>
                        <div className="policyCardDetails">
                            <div className="policyCardName">{policyName}</div>
                            <div className="policyCardDesc packSubName">{policyDesc}</div>
                            <div className="policyContents">
                                {contents}
                            </div>
                        </div>
                    </div>
                );
            }

        }
    );

    return policyDetails;
});
