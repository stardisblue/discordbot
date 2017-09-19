"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require("discord.js");
var moment = require("moment-timezone");
var Planning_1 = require("./src/Planning");
var config = require("./config.json");
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
var bot = new Discord.Client();
bot.on("ready", function () {
    bot.user.setGame("EDT M2 S1 INFO")
        .then(function (value) { return console.log("gameSet"); })
        .catch(function (reason) { return console.error(reason); });
    if (bot.user.username !== "EDT Bot") {
        bot.user.setUsername("EDT Bot")
            .then(function (value) { return console.log("username Set"); })
            .catch(function (reason) { return console.error(reason); });
    }
});
bot.on("message", function (message) {
    if (message.content.charAt(0) !== "!") {
        return;
    }
    var args = message.content.split(" ");
    if (args[0] === "!now") {
        Planning_1.default.now(message, args);
    }
    else if (args[0] === "!next") {
        Planning_1.default.next(message, args);
    }
    else if (args[0] === "!today") {
        Planning_1.default.today(message, args);
    }
    else if (args[0] === "!tomorrow") {
        Planning_1.default.tomorrow(message, args);
    }
    else if (args[0] === "!link") {
        message.channel.send(Planning_1.default.link(args));
    }
    else if (args[0] === "!help") {
        message.channel.send(Planning_1.default.help());
    }
});
bot.login(config.discordtoken).then(function (string) {
    console.log("Connection successful :" + string);
}).catch(function (reason) {
    console.error("Connection failed : " + reason.toString());
});
