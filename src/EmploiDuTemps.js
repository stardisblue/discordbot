"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ical = require("ical");
var moment = require("moment-timezone");
var Resource_1 = require("./Resource");
var EventFactory_1 = require("./EventFactory");
var Config = require("../config");
var EmploiDuTemps = /** @class */ (function () {
    function EmploiDuTemps() {
    }
    EmploiDuTemps.now = function (message, args) {
        if (args.length !== 2) {
            message.channel.send("`incorrect number of arguments`");
            return;
        }
        if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
            message.channel.send(args[1] + " is not in the list");
            return;
        }
        ical.fromURL(Resource_1.default.createURL(Resource_1.default.getId("master2", "info", 1, args[1]), EmploiDuTemps.currentDay), {}, function (err, data) {
            var events = EventFactory_1.default.importData(data)
                .filter(function (event) { return moment().isBetween(event.start, event.end); });
            message.channel.send(EventFactory_1.default.format(events, args[1]));
        });
    };
    EmploiDuTemps.next = function (message, args) {
        if (args.length !== 2) {
            message.channel.send("`incorrect number of arguments`");
            return;
        }
        if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
            message.channel.send(args[1] + " is not in the list");
            return;
        }
        ical.fromURL(Resource_1.default.createURL(Resource_1.default.getId("master2", "info", 1, args[1]), 2), {}, function (err, data) {
            var allEvents = EventFactory_1.default.importData(data);
            var events = [];
            var minMoment = null;
            allEvents.forEach(function (event) {
                if (moment().isBefore(event.start)) {
                    if (minMoment === null) {
                        minMoment = event.start;
                        events = [event];
                    }
                    else {
                        if (minMoment.isAfter(event.start)) {
                            minMoment = event.start;
                            events = [event];
                        }
                        else if (minMoment.isSame(event.start)) {
                            events.push(event);
                        }
                    }
                }
            });
            message.channel.send(EventFactory_1.default.format(events, args[1]));
        });
    };
    EmploiDuTemps.today = function (message, args) {
        if (args.length < 2) {
            message.channel.send("`incorrect number of arguments`");
            return;
        }
        if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
            message.channel.send(args[1] + " is not in the list");
            return;
        }
        if (args.length === 2) {
            args.push("");
        }
        ical.fromURL(Resource_1.default.createURL(Resource_1.default.getId("master2", "info", 1, args[1]), EmploiDuTemps.currentDay), {}, function (err, data) {
            var events = EventFactory_1.default.importData(data).filter(function (event) {
                var now = moment();
                if (now.isSame(event.start, "day")) {
                    if (args[2] !== "left" || now.isBefore(event.start)) {
                        return true;
                    }
                }
                return false;
            });
            message.channel.send(EventFactory_1.default.format(events, args[1]));
        });
    };
    EmploiDuTemps.tomorrow = function (message, args) {
        if (args.length !== 2) {
            message.channel.send("`incorrect number of arguments`");
            return;
        }
        if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
            message.channel.send(args[1] + " is not in the list");
            return;
        }
        ical.fromURL(Resource_1.default.createURL(Resource_1.default.getId("master2", "info", 1, args[1]), 1), {}, function (err, data) {
            var events = EventFactory_1.default.importData(data)
                .filter(function (event) { return moment().add(1, "d").isSame(event.start, "day"); });
            message.channel.send(EventFactory_1.default.format(events, args[1]));
        });
    };
    EmploiDuTemps.link = function (args) {
        if (args.length !== 2) {
            return "`incorrect number of arguments`";
        }
        if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
            return args[1] + " is not in the list";
        }
        return "[EDT " + args[1] + "](" + Config.planning + "&resources=" +
            Resource_1.default.getId("master2", "info", 1, args[1]) + ")";
    };
    EmploiDuTemps.help = function () {
        return "**Commandes** : \n" +
            "`!now !next !today !tomorrow !link`\n\n" +
            "**Specialities** : `info`, `aigle`, `decol`, `imagina`, `mit`, `msi`\n\n" +
            "`!now` displays the information of the actuals classes\n" +
            "  _usage_ : `!now <speciality>`\n\n" +
            "`!next` displays the information of the following classes\n" +
            "  _usage_ : `!next <speciality>`\n\n" +
            "`!today` displays today's classes\n" +
            "  _usage_ : `!today <speciality> [left]`\n\n" +
            "`!tomorrow`  displays tomorrow's classes\n" +
            "  _usage_ : `!tomorrow <speciality>`\n\n" +
            "`!link` : creates a link to the original EDT for the wanted speciality\n" +
            "  _usage_ : `link <speciality>`";
    };
    EmploiDuTemps.currentDay = 0;
    return EmploiDuTemps;
}());
exports.default = EmploiDuTemps;
//# sourceMappingURL=EmploiDuTemps.js.map