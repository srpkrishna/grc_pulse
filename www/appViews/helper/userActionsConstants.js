define(function () {
    var list = [{
        id: 1,
        text: "exceptions",
        cssClass: "exceptions",
        href: "/root/exception",
        activeView: false
    }, {
        id: 2,
        text: "incidents",
        cssClass: "incident",
        href: "/root/incident",
        activeView: false
    }, {
        id: 3,
        text: "tasks",
        cssClass: "userTask",
        href: "/root/task",
        activeView: true
    }, {
        id: 4,
        text: "hub",
        cssClass: "hub",
        href: "/root/hub",
        activeView: false
    }, {
        id: 5,
        text: "profile",
        cssClass: "profile",
        href: "/root/profile",
        activeView: false
    }];

    return {
        getActionList: function () {
            return list;
        },
        setActiveAction: function (id) {
            for (var i = 0; i < list.length; i++) {
                if (id === list[i].id) {
                    list[i].activeView = true;
                }
                else {
                    list[i].activeView = false;
                }
            }
        },
        isTaskActive: function () {
            var isActive = false;
            for (var i = 0; i < list.length; i++) {
                if (3 === list[i].id) {
                    isActive = list[i].activeView;
                    break;
                }
            }
            return isActive;
        }
    };
});
