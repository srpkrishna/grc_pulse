define(function (require) {
    var store = require("util/store");
    var Back = require("./back");
    var actions = require("util/actions");
    var packDetails = React.createClass(
        {displayName: "packDetails",
            handleClick: function (i) {
                var policy = this.state.packContents[i];
                var qParams = "pid=" + policy.Id;
                qParams = qParams + "&" + "pname=" + policy.Name;
                qParams = qParams + "&" + "pdesc=" + policy.Policy_Description__c;

                var goToUrl = "/policyDetails?" + encodeURI(qParams);
                actions.changeUrl({
                    href: goToUrl
                });
                mixpanel.track("App-On-PackDetails-Clicked");
            },
            getInitialState: function () {
                return {packContents: []}
            },
            getContents: function (contents) {
                var that = this;
                var packContents = contents.map(function (content, i) {
                    var fileName = cordova.file.applicationDirectory + "www/css/svg/" + "active%20step%20connector.svg";
                    return (

                        React.createElement("div", {className: "packContent", key: i, onClick: that.handleClick.bind(that, i)}, 
                            React.createElement("img", {className: "policySymb", src: fileName}), 
                            React.createElement("div", {className: "policyName"}, content.Name)
                        )
                    );
                });

                return packContents;
            },
            componentDidMount: function () {
                var that = this;
                var packId = store.getParameterByName("pid");

                var getPackDetails = require("util/serverData/getPolicies");
                getPackDetails(packId,
                    function (data) {
                        that.setState({
                            packContents: data.records
                        });
                        mixpanel.track("App-On-PackDetails-Fetched");
                    }
                );
                mixpanel.track("App-On-PackDetails-Loaded");
            },
            render: function () {
                var packName = store.getParameterByName("pname");
                var packSubName = store.getParameterByName("pdesc");
                if (!packSubName) {
                    packSubName = "";
                }

                var contents = this.getContents(this.state.packContents);
                return (
                    React.createElement("div", {className: "container"}, 
                        React.createElement("div", {className: "pageTitle"}, getString("grc_packs_details")), 
                        React.createElement("div", {className: "packCardDetails"}, 
                            React.createElement("div", {className: "packName"}, packName), 
                            React.createElement("div", {className: "packSubName"}, packSubName), 
                            React.createElement("div", {className: "packContents"}, 
                                contents
                            )
                        )
                    )
                );
            }

        }
    );

    return packDetails;
});
