define(function () {
    return {
        query: function (sql, cbSuccess, cbFailure) {
            window.ms.grcPulse.forceClient.query(sql, function (data) {
                if (cbSuccess) {
                    cbSuccess(data);
                }
            }, function (error) {
                if (cbFailure) {
                    cbFailure(error);
                }
                alert("Error calling server :: " + error);
            });
        },
        rest: function (url, cbSuccess, cbFailure) {
            window.ms.grcPulse.forceClient.rest(url, function (data) {
                if (cbSuccess) {
                    cbSuccess(data);
                }
            }, function (error) {
                if (cbFailure) {
                    cbFailure(error);
                }
                alert("Error calling server :: " + error);
            });
        },
        restCustomURL: function (url, cbSuccess, cbFailure) {
            window.ms.grcPulse.forceClient.restCustomURL(url, function (data) {
                if (cbSuccess) {
                    cbSuccess(data);
                }
            }, function (error) {
                if (cbFailure) {
                    cbFailure(error);
                }
                alert("Error calling server :: " + error);
            });
        },
        post: function (objtype, fields, cbSuccess, cbFailure) {
            window.ms.grcPulse.forceClient.create(objtype, fields, function (data) {
                if (cbSuccess) {
                    cbSuccess(data);
                }
            }, function (error) {
                if (cbFailure) {
                    cbFailure(error);
                }
                alert("Error calling server :: " + error);
            });
        },
        update: function (objtype, id, fields, cbSuccess, cbFailure) {
            //objtype, id, fields, callback, error
            window.ms.grcPulse.forceClient.update(objtype, id, fields, function (data) {
                if (cbSuccess) {
                    cbSuccess(data);
                }
            }, function (error) {
                if (cbFailure) {
                    cbFailure(error);
                }
                alert("Error calling server :: " + error);
            });
        },
        insert: function (objtype, fields, cbSuccess, cbFailure) {
            window.ms.grcPulse.forceClient.customUpsert(objtype, fields, function (data) {
                if (cbSuccess) {
                    cbSuccess(data);
                }
            }, function (error) {
                if (cbFailure) {
                    cbFailure(error);
                }
                alert("Error calling server :: " + error);
            });
        },
        downloadAWSFile: function (note, cbSuccess, cbFailure) {
            window.ms.grcPulse.forceClient.downloadAWSFile(note, function (data) {
                if (cbSuccess) {
                    cbSuccess(data);
                }
            }, function (error) {
                if (cbFailure) {
                    cbFailure(error);
                }
                alert("Error calling server :: " + error);
            });
        }
    };
});
