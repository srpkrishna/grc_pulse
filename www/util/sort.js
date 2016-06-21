/**
 * Created by asinha on 21/06/16.
 */
define(function (require) {
    var sort = function (resources) {
        try {
            var swapped;
            do {
                swapped = false;
                for (var i = 0; i < resources.length - 1; i++) {
                    if (resources[i].seqNo > resources[i + 1].seqNo) {
                        var temp = resources[i];
                        resources[i] = resources[i + 1];
                        resources[i + 1] = temp;
                        swapped = true;
                    }
                }
            } while (swapped);
        }
        catch (e) {
            console.log("Error on while sorting" + e);
        }
        return resources;
    };
    return sort;
});