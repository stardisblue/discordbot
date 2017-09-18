'use strict'

const Discord = require('discord.js')
const Ical = require('ical')
const Moment = require('moment-timezone')

const config = require('./config')
const edt = require('./src/edt')

const Ressource = require('./src/resource')
const EventFactory = require('./src/event-factory')
const EventWrapper = require('./src/event-wrapper')

Moment.locale('fr')
Moment.tz.setDefault('Europe/Paris')
Moment.updateLocale('fr', {
  calendar: {
    sameDay: '[Auj de] LT',
    nextDay: '[Demain de] LT',
  },
})

// RSS : https://planning-ade.umontpellier.fr/direct/gwtdirectplanning/rss?projectId=54&resources=4800&cliendId=1505246956191&nbDays=15&since=0&login=visuFDS&password=12345678
//
// ICAL : https://planning-ade.umontpellier.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=4608,4751,4773,4777,4796&projectId=54&calType=ical&nbWeeks=4
// if nbweeks = 0 c'est pour auj :)

const today = 0

const bot = new Discord.Client()

bot.on('ready', function() {
  if (bot.game !== 'EDT M2 S1 INFO') {
    bot.user.setGame('EDT M2 S1 INFO')
  }
  if (bot.user.username !== 'EDT Bot') {
    bot.user.setUsername('EDT Bot')
  }
})

bot.on('message', function(message) {

  if (message.content.charAt(0) !== '!') {
    return
  }

  var args = message.content.split(' ')

  if (args[0] === '!now') {
    edt.now(message, args)
  } else if (args[0] === '!next') {
    edt.next(message, args)
  } else if (args[0] === '!today') {
    edt.today(message, args)
  } else if (args[0] === '!tomorrow') {
    edt.tomorrow(message, args)
  } else if (args.length === 2 && args[0] === '!link') {
    message.channel.send(edt.link(args))
  } else if (args[0] === '!help') {
    message.channel.send(edt.help())
  }
})

bot.login(config.discordtoken).
    then(function(string) {
      console.log('Connection successful :' + string)
    }).
    catch(function(reason) {
      console.log('Connection failed : ' + reason.toString())
    })