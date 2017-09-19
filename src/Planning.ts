import * as ical from "ical";
import * as moment from "moment-timezone";
import {Message} from "discord.js";

import Resource from "./Resource";
import EventFactory from "./EventFactory";
import EventWrapper from "./EventWrapper";
import Config = require("../config");


export default class Planning {

    static now(message: Message, args: string[]): void {
        if (args.length !== 2) {
            message.channel.send("`incorrect number of arguments`");
            return;
        }

        if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
            message.channel.send(args[1] + " is not in the list");
            return;
        }

        ical.fromURL(
            Resource.createURL(
                Resource.getId("master2", "info", 1, args[1]), 0),
            {},
            (err, data) => {
                const events = EventFactory.importData(data)
                    .filter((event: EventWrapper) => moment().isBetween(event.start, event.end));

                message.channel.send(EventFactory.format(events, args[1]));
            });

    }

    static next(message: Message, args: string[]): void {
        if (args.length !== 2) {
            message.channel.send("`incorrect number of arguments`");
            return;
        }

        if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
            message.channel.send(args[1] + " is not in the list");
            return;
        }

        ical.fromURL(
            Resource.createURL(
                Resource.getId("master2", "info", 1, args[1]), 2),
            {},
            (err, data) => {
                const allEvents: EventWrapper[] = EventFactory.importData(data);
                let events: EventWrapper[] = [];
                let minMoment: moment = null;

                allEvents.forEach(event => {
                    if (moment().isBefore(event.start)) {
                        if (minMoment === null) {
                            minMoment = event.start;
                            events = [event];
                        } else {
                            if (minMoment.isAfter(event.start)) {
                                minMoment = event.start;
                                events = [event];
                            } else if (minMoment.isSame(event.start)) {
                                events.push(event);
                            }
                        }
                    }
                });

                message.channel.send(EventFactory.format(events, args[1]));
            });
    }

    static today(message: Message, args: string[]): void {
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

        ical.fromURL(
            Resource.createURL(
                Resource.getId("master2", "info", 1, args[1]), 1),
            {},
            (err, data) => {
                const events: EventWrapper[] = EventFactory.importData(data).filter((event) => {
                    const now = moment();
                    if (now.isSame(event.start, "day")) {
                        if (args[2] !== "left" || now.isBefore(event.start)) {
                            return true;
                        }
                    }
                    return false;
                });

                message.channel.send(EventFactory.format(events, args[1]));
            });
    }

    static tomorrow(message: Message, args: string[]): void {
        if (args.length !== 2) {
            message.channel.send("`incorrect number of arguments`");
            return;
        }

        if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
            message.channel.send(args[1] + " is not in the list");
            return;
        }

        ical.fromURL(
            Resource.createURL(
                Resource.getId("master2", "info", 1, args[1]), 1),
            {},
            (err, data) => {
                const events: EventWrapper[] = EventFactory.importData(data)
                    .filter((event) => moment().add(1, "d").isSame(event.start, "day"));

                message.channel.send(EventFactory.format(events, args[1]));
            });

    }

    static link(args: string[]): string {
        if (args.length !== 2) {
            return "`incorrect number of arguments`";
        }

        if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
            return args[1] + " is not in the list";
        }

        return Config.planning + "&resources=" +
            Resource.getId("master2", "info", 1, args[1]);

    }

    static help(): string {
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
    }
}