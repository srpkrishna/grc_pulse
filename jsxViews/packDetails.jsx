define(function (require) {
    var store = require("util/store");
    var Back = require("./back");
    var actions = require("util/actions");
    var packDetails = React.createClass(
        {
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

                        <div className="packContent" key={i} onClick={that.handleClick.bind(that, i)}>
                            <img className="policySymb" src={fileName}/>
                            <div className="policyName">{content.Name}</div>
                        </div>
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
                    <div className="container">
                        <div className="pageTitle">{getString("grc_packs_details")}</div>
                        <div className="packCardDetails">
                            <div className="packName">{packName}</div>
                            <div className="packSubName">{packSubName}</div>
                            <div className="packContents">
                                {contents}
                            </div>
                        </div>
                    </div>
                );
            }

        }
    );

    return packDetails;
});
