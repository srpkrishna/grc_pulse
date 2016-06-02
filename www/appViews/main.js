define(function (require) {
    var actions = require("util/actions");
    var App = React.createFactory(require("./appContainer"));
    ReactDOM.render(new App({}), document.getElementById("bodyMainContainer"));
    actions.changeUrl({
        href: "/splash"
    });
});

var openViewer = function (url) {
    SitewaertsDocumentViewer.viewDocument(
        url,
        'application/pdf',
        {},
        function () {
            // shown
            //window.console.log('document shown');
        },
        function () {
            // closed
            //window.console.log('document closed');
        },
        function (appId, installer) {
            // missing app
            if (confirm("Do you want to install the free PDF Viewer App "
                    + appId + " for Android?")) {
                installer(
                    function () {
                        //window.console.log('successfully installed app');
                        if (confirm("App installed. Do you want to view the document now?"))
                            viewDocument(url, mimeType, storage);
                    },
                    function (error) {
                        //window.console.log('cannot install app');
                        //window.console.log(error);
                    }
                );
            }
        },
        function (error) {
            alert(getString("error_pdfreader_notfound"));
            //window.console.log('cannot view document ');
            //window.console.log(error);
        }
    );
};