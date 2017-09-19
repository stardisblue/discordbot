"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment-timezone");
var EventWrapper = /** @class */ (function () {
    function EventWrapper(unformattedEvent) {
        var _this = this;
        var descriptionArray = unformattedEvent.description.split("\n");
        descriptionArray = descriptionArray.filter(function (line) { return line !== ""; });
        this.name = "";
        this.code = unformattedEvent.summary;
        this.location = unformattedEvent.location;
        this.start = moment(unformattedEvent.start);
        this.end = moment(unformattedEvent.end);
        this.specialities = [];
        descriptionArray.forEach(function (line) {
            if (line.substr(0, _this.code.length) === _this.code) {
                _this.name = line.replace(_this.code, "").trim();
            }
            else {
                var specArr = line.split("-");
                if (specArr.length > 1) {
                    _this.specialities.push(specArr[1].replace(_this.code, "").trim());
                }
            }
        });
        this.specialities.sort();
    }
    EventWrapper.prototype.embed = function () {
        return {
            "name": "[" + this.code + "] " + this.name,
            "value": ":calendar_spiral: " + this.start.calendar() + " à " +
                this.end.format("HH:mm") + "\n:school: " + this.location +
                "\n\t\t #`" + this.specialities.join(", ") + "`",
        };
    };
    return EventWrapper;
}());
exports.default = EventWrapper;
//# sourceMappingURL=EventWrapper.js.map