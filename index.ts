import * as Discord from "discord.js";
import * as moment from "moment-timezone";

import EmploiDuTemps from "./src/EmploiDuTemps";
import config = require("./config.json");

moment.locale("fr");
moment.tz.setDefault("Europe/Paris");
moment.updateLocale("fr", {
    calendar: {
        sameDay: "[Auj de] LT",
        nextDay: "[Demain de] LT",
    },
});

// RSS : https://planning-ade.umontpellier.fr/direct/gwtdirectplanning/rss?projectId=54&resources=4800&cliendId=1505246956191&nbDays=15&since=0&login=visuFDS&password=12345678
//
// ICAL : https://planning-ade.umontpellier.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=4608,4751,4773,4777,4796&projectId=54&calType=ical&nbWeeks=4
// if nbweeks = 0 c'est pour auj :)

const bot = new Discord.Client();

bot.on("ready", function () {
    bot.user.setGame("EDT M2 S1 INFO")
        .then(value => console.log("gameSet"))
        .catch(reason => console.error(reason));

    if (bot.user.username !== "EDT Bot") {
        bot.user.setUsername("EDT Bot")
            .then(value => console.log("username Set"))
            .catch(reason => console.error(reason));

    }
});

bot.on("message", function (message) {

    if (message.content.charAt(0) !== "!") {
        return;
    }

    const args = message.content.split(" ");

    if (args[0] === "!now") {
        EmploiDuTemps.now(message, args);
    } else if (args[0] === "!next") {
        EmploiDuTemps.next(message, args);
    } else if (args[0] === "!today") {
        EmploiDuTemps.today(message, args);
    } else if (args[0] === "!tomorrow") {
        EmploiDuTemps.tomorrow(message, args);
    } else if (args.length === 2 && args[0] === "!link") {
        message.channel.send(EmploiDuTemps.link(args));
    } else if (args[0] === "!help") {
        message.channel.send(EmploiDuTemps.help());
    }
});

bot.login(config.discordtoken).then(function (string) {
    console.log("Connection successful :" + string);
}).catch(function (reason) {
    console.error("Connection failed : " + reason.toString());
});
