import * as moment from "moment-timezone";

import EventWrapper from "./EventWrapper";
import Resource from "./Resource";
import config = require("../config.json");

export default class EventFactory {
    static importData(data: object): EventWrapper[] {
        const events = Object.getOwnPropertyNames(data).map(value => new EventWrapper(data[value]));

        events.sort(function (a, b) {
            if (a.start.isBefore(b.start)) {
                return -1;
            } else if (a.start.isAfter(b.start)) {
                return 1;
            }

            return 0;
        });

        return events;
    }

    static format(events: EventWrapper[], speciality: string): object | string {
        if (Array.isArray(events)) {
            if (events.length === 0) {
                return "`nothing`";
            }

            const fields: object[] = events.map(value => value.embed());

            return {
                "embed": {
                    "title": ":link: EDT " + speciality.toUpperCase(),
                    "url": config.planning + "&resources=" +
                    Resource.getId("master2", "info", 1, speciality),
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
    }
}
