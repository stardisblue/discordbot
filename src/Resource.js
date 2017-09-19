"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../config.json");
var Resource = /** @class */ (function () {
    function Resource() {
    }
    Resource.defaultURL = function () {
        return config.url + "projectId=" +
            config.projectId + "&calType=ical";
    };
    Resource.createURL = function (resources, nbWeeks) {
        if (Array.isArray(resources))
            return Resource.defaultURL() + "&resources=" + resources.join() +
                "&nbWeeks=" + nbWeeks;
        if (!isNaN(+resources))
            return Resource.defaultURL() + "&resources=" + resources + "&nbWeeks=" + nbWeeks;
    };
    Resource.getId = function (formation, department, semester, speciality) {
        return config[formation][department]["semesters"][semester][speciality];
    };
    return Resource;
}());
exports.default = Resource;
//# sourceMappingURL=resource.js.map