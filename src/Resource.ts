import config = require("../config.json");

export default class Resource {
    static defaultURL() {
        return config.url + "projectId=" +
            config.projectId + "&calType=ical";
    }

    static createURL(resources: number | string[], nbWeeks: number): string {
        if (Array.isArray(resources))
            return Resource.defaultURL() + "&resources=" + resources.join() +
                "&nbWeeks=" + nbWeeks;

        if (!isNaN(+resources))
            return Resource.defaultURL() + "&resources=" + resources + "&nbWeeks=" + nbWeeks;
    }

    static getId(formation: string, department: string, semester: string, speciality: string): number {
        return config[formation][department]["semesters"][semester][speciality];
    }
}