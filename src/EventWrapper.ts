import * as moment from "moment-timezone";

export default class EventWrapper {
    end: moment;
    start: moment;
    location: string;
    code: string;
    name: string;
    specialities: string[];

    constructor(unformattedEvent: any) {
        let descriptionArray: string [] = unformattedEvent.description.split("\n");
        descriptionArray = descriptionArray.filter(line => line !== "");

        this.name = "";
        this.code = unformattedEvent.summary;
        this.location = unformattedEvent.location;
        this.start = moment(unformattedEvent.start);
        this.end = moment(unformattedEvent.end);

        this.specialities = [];
        descriptionArray.forEach(line => {
            if (line.substr(0, this.code.length) === this.code) {
                this.name = line.replace(this.code, "").trim();
            } else {
                let specArr = line.split("-");
                if (specArr.length > 1) {
                    this.specialities.push(specArr[1].replace(this.code, "").trim());
                }
            }
        });


        this.specialities.sort();
    }

    embed(): object {
        return {
            "name": "[" + this.code + "] " + this.name,
            "value": ":calendar_spiral: " + this.start.calendar() + " à " +
            this.end.format("HH:mm") + "\n:school: " + this.location +
            "\n\t\t #`" + this.specialities.join(", ") + "`",
        };
    }
}