define(function (require) {
    var actions = require("util/actions");
    var store = require("util/store");
    var readMc;
    var unReadMc;

    var isEmpty = function (htmlElement) {
        return !$.trim(htmlElement.html())
    }

    var packs = React.createClass({

        getInitialState: function () {

            return {
                value: 0,
                packs: store.getPacks()
            }
        },
        _onReadClick: function (event) {
            var currentVal = this.state.value;
            this.setState({value: currentVal - 1});
        },
        _onUnReadClick: function (event) {
            var currentVal = this.state.value;
            this.setState({value: currentVal + 1});

        },
        _goToCardDetail: function () {
            var packs = this.state.packs;
            var pack = packs[this.state.value];
            var qParams = "pid=" + pack.Id;
            qParams = qParams + "&" + "pname=" + pack.Name;
            qParams = qParams + "&" + "pdesc=" + pack.Pack_Description__c;

            var goToUrl = "/packDetails?" + encodeURI(qParams);
            actions.changeUrl({
                href: goToUrl
            });
        },
        addEvents: function () {
            var id = "packCard" + this.state.value;
            var element = document.getElementById(id);

            if (element) {
                unReadMc = new Hammer.Manager(element);
                unReadMc.add(new Hammer.Swipe({direction: Hammer.DIRECTION_VERTICAL, threshold: 0}));
                unReadMc.add(new Hammer.Tap({event: "singletap"}));
                unReadMc.on("swipedown", this._onUnReadClick);
                unReadMc.on("singletap", this._goToCardDetail);

                unReadMc.on("dragleft dragright", function (ev) {
                    ev.gesture.preventDefault();
                })
            }

            id = "packCard" + (this.state.value - 1);
            var element = document.getElementById(id);

            if (element) {
                readMc = new Hammer.Manager(element);
                readMc.add(new Hammer.Swipe({direction: Hammer.DIRECTION_VERTICAL, threshold: 0}));
                readMc.on("swipeup", this._onReadClick);
                readMc.on("dragleft dragright", function (ev) {
                    ev.gesture.preventDefault();
                })
            }

        },
        removeEvents: function () {

            if (readMc) {
                readMc.destroy();
            }

            if (unReadMc) {
                unReadMc.destroy();
            }

        },
        componentDidMount: function () {
            this.addEvents();

            if (store.getPacks().length > 0) {
                return;
            }
            var that = this;

            var getPacks = require("util/serverData/getPacks");
            getPacks(
                function (data) {
                    var currentVal = that.state.value;
                    store.setPacks(data.records);
                    that.setState({
                        value: currentVal,
                        packs: data.records
                    });
                }
            );

        },
        componentDidUpdate: function () {
            this.addEvents();

        },
        componentWillUpdate: function () {
            this.removeEvents();

        },
        componentWillUnMount: function () {
            this.removeEvents();

        },
        getPacksUI: function () {
            var obj = [];

            var currentVal = this.state.value;
            var packs = this.state.packs;

            if (currentVal < packs.length - 1) {
                obj.push(<div key={"bgunread"} className="packCardBG"/>);

            }

            //this loop run for one unread card and one read card
            for (var i = currentVal - 1; i < currentVal + 1; i++) {

                var cssName = "packCard read active";
                if (i === currentVal) {
                    cssName = "packCard active ";
                }

                var pack = packs[i];

                // this happend when currentVal is zero or packsLength-1 in that
                //either read cards are zero or unread cards are zero
                if (!pack) {
                    continue;
                }
                var imgName = "logo.svg";

                if ("ISMS" === pack.Name || "SOX" === pack.Name) {
                    imgName = encodeURI(pack.Name + " Pack Image.svg");
                }
                var fileName = cordova.file.applicationDirectory + "www/css/svg/" + imgName;
                obj.push(
                    <div className={cssName} key={i} id={"packCard"+i}>
                        <div className="packName">{pack.Name}</div>
                        <div className="packSubName">{pack.Pack_Description__c ? pack.Pack_Description__c : ""}</div>
                        <img className="packImg" src={fileName}></img>
                    </div>
                );

            }


            if (currentVal > 1) {
                obj.push(<div key={"bgread"} className="packCardBG read"/>);
            }
            return obj;

        },
        render: function () {
            var contents = this.getPacksUI();
            return (
                <div>
                    <div className="pageTitle">{getString("grc_packs")}</div>
                    {contents}
                </div>
            );
        }
    });

    return packs;
});
