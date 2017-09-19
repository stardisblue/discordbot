"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment-timezone");
var EventWrapper_1 = require("./EventWrapper");
var Resource_1 = require("./Resource");
var config = require("../config.json");
var EventFactory = /** @class */ (function () {
    function EventFactory() {
    }
    EventFactory.importData = function (data) {
        var events = Object.getOwnPropertyNames(data).map(function (value) { return new EventWrapper_1.default(data[value]); });
        events.sort(function (a, b) {
            if (moment(a.start).isBefore(b.start)) {
                return -1;
            }
            else if (moment(a.start).isAfter(b.start)) {
                return 1;
            }
            return 0;
        });
        return events;
    };
    EventFactory.format = function (events, speciality) {
        if (Array.isArray(events)) {
            if (events.length === 0) {
                return "`nothing`";
            }
            var fields = events.map(function (value) { return value.embed(); });
            return {
                "embed": {
                    "title": ":link: EDT " + speciality.toUpperCase(),
                    "url": config.planning + "&resources=" +
                        Resource_1.default.getId("master2", "info", 1, speciality),
                    "color": 255,
                    "timestamp": moment(),
                    "footer": {
                        "text": "EDT Bot by stardisblue",
                    },
                    "fields": fields,
                },
            };
        }
        return "";
    };
    return EventFactory;
}());
exports.default = EventFactory;
//# sourceMappingURL=EventFactory.js.map