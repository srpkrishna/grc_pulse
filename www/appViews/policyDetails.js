define(function (require) {
    var store = require("util/store");
    var actions = require("util/actions");
    var policyDetails = React.createClass(
        {displayName: "policyDetails",
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

            },
            getInitialState: function () {
                return {policyContents: []}
            },
            getContents: function (contents) {
                var that = this;
                var policyContents = contents.map(function (content, i) {
                    var fileName = cordova.file.applicationDirectory + "www/css/svg/" + "active%20step%20connector.svg";
                    return (

                        React.createElement("div", {className: "policyContent", key: i, onClick: that.handleClick.bind(that, i)}, 
                            React.createElement("img", {className: "noteSymb", src: fileName}), 
                            React.createElement("div", {className: "noteName"}, content.Title)
                        )
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

            },
            render: function () {
                var policyName = store.getParameterByName("pname");
                var policyDesc = store.getParameterByName("pdesc");
                if (!policyDesc || policyDesc === "null") {
                    policyDesc = "";
                }

                var contents = this.getContents(this.state.policyContents);
                return (
                    React.createElement("div", {className: "container"}, 
                        React.createElement("div", {className: "pageTitle"}, getString("grc_policy_details")), 
                        React.createElement("div", {className: "policyCardDetails"}, 
                            React.createElement("div", {className: "policyCardName"}, policyName), 
                            React.createElement("div", {className: "policyCardDesc packSubName"}, policyDesc), 
                            React.createElement("div", {className: "policyContents"}, 
                                contents
                            )
                        )
                    )
                );
            }

        }
    );

    return policyDetails;
});
