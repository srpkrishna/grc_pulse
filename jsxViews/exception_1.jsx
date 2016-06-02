define(function (require) {
    function getExceptionDetails() {
        var exceptionDetails = [];
        exceptionDetails.push({
            "expName": "Enable USB",
            "packname": "ISMS",
            "packDept": "IT",
            "buttonname": "Request",
            "backgroundcolor": "reqColor"
        });

        exceptionDetails.push({
            "expName": "Unblock website",
            "packname": "ISMS",
            "packDept": "IT",
            "buttonname": "Request",
            "backgroundcolor": "reqColor"
        });

        exceptionDetails.push({
            "expName": "Get Static IP",
            "packname": "ISMS",
            "packDept": "IT",
            "buttonname": "Pending",
            "backgroundcolor": "pendingColor"
        });

        exceptionDetails.push({
            "expName": "Install 3rd Party Software",
            "packname": "ISMS",
            "packDept": "IT",
            "buttonname": "Active",
            "backgroundcolor": ""
        });

        exceptionDetails.push({
            "expName": "Enable webcam",
            "packname": "ISMS",
            "packDept": "IT",
            "buttonname": "12d",
            "backgroundcolor": "daysRemColor"
        });

        return exceptionDetails;
    }


    var Exception = React.createClass({


        clickOnLabelDiv: function (event) {

            event.stopPropagation();

            var text = $(event.target).text();
            if (text === "Pending") {
                alert("Your exception is in process please wait until it resolves");
                return;
            }
            var tabContentDiv = $(event.target).parent().siblings("#tabcontent");
            if ($(tabContentDiv).hasClass("tab-content")) {
                $(tabContentDiv).removeClass("tab-content").addClass("tab-growHeight");
                $(event.target).html("Send");

            } else {
                $(tabContentDiv).removeClass("tab-growHeight").addClass("tab-content");
                var className = $(event.target).attr('class');
                $(event.target).html("Pending");
                $(event.target).removeClass(className).addClass("reqButton pendingColor");


            }

        },


        render: function () {

            var src = cordova.file.applicationDirectory + "www/css/img/exceptions.jpg";
            var indents = [];
            var exceptionsdet = getExceptionDetails();
            console.log(exceptionsdet.length);
            for (var i = 0; i < exceptionsdet.length; i++) {
                var eachException = exceptionsdet[i];
                var titleLabel = eachException["expName"];
                var packageBtName = eachException["packname"];
                var pacdept = eachException["packDept"];
                var reqButton = eachException["buttonname"];
                var buttonCSS = "reqButton " + eachException["backgroundcolor"];
                indents.push(
                    <div className="exp_row">

                        <div className="exp_left_wrapper">
                            <label className="rowtitle">{titleLabel}</label>
                            <button type="button" className="package">{packageBtName}</button>
                            <label className="packagetitle">{pacdept}</label>
                        </div>

                        <div className="exp_right_wrapper">
                            <button className={buttonCSS} type="button" id="requestid"
                                    onClick={this.clickOnLabelDiv}>{reqButton}</button>
                        </div>

                        <div className="tab-content" id="tabcontent">

                            ​<textarea id="tabcontenttextbox" rows="10" cols="70"></textarea>

                        </div>

                    </div>
                );
            }
            return (

                <div className="exp_container">
                    <div className="exp_title">
                        <label className="exp_title_label">Exceptions</label>
                    </div>
                    <div className="exp_wrapper">
                        {indents}
                    </div>
                </div>
            );
        }
    });
    return Exception;
});
