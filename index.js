const Discord = require('discord.js')
var ical = require('ical')
const Ressource = require('./ressource')
const Moment = require('moment-timezone')
const Config = require('./config')

Moment.locale('fr')
Moment.tz.setDefault('Europe/Paris')
Moment.updateLocale('fr', {
  calendar: {
    sameDay: '[Auj à] LT',
    nextDay: '[Demain à] LT',
  },
})

// RSS : https://planning-ade.umontpellier.fr/direct/gwtdirectplanning/rss?projectId=54&resources=4800&cliendId=1505246956191&nbDays=15&since=0&login=visuFDS&password=12345678
//
// ICAL : https://planning-ade.umontpellier.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=4608,4751,4773,4777,4796&projectId=54&calType=ical&nbWeeks=4
// if nbweeks = 0 c'est pour auj :)

const today = 0

const bot = new Discord.Client()

bot.on('ready', function() {
  bot.user.setGame('EDT M2 S1 INFO')
  bot.user.setUsername('EDT bot')
})

bot.on('message', function(message) {

  if (message.content.charAt(0) !== '!') {
    return
  }

  var messageArray = message.content.split(' ')

  if (messageArray.length === 2 && messageArray[0] === '!now') {
    if (Config.master['2'].info.specialities.indexOf(messageArray[1]) !== -1) {
      ical.fromURL(
          Ressource.createURL(
              Ressource.getId('master', 2, 'info', 1, messageArray[1]), today),
          {},
          function(err, data) {
            var events = []

            for (var k in data) {
              var event = data[k]

              if (Moment().isBetween(Moment(event.start), Moment(event.end))) {
                events.push(event)
              }
            }

            message.channel.send(eventsToString(events))
          })
    }
  } else if (messageArray.length === 2 && messageArray[0] === '!next') {
    if (Config.master['2'].info.specialities.indexOf(messageArray[1]) !== -1) {

      ical.fromURL(
          Ressource.createURL(
              Ressource.getId('master', 2, 'info', 1, messageArray[1]), 2),
          {},
          function(err, data) {
            var events = []
            var minMoment

            for (var k in data) {
              var event = data[k]

              if (Moment().isBefore(event.start)) {
                if (minMoment !== undefined) {
                  if (minMoment.isAfter(event.start)) {
                    minMoment = Moment(event.start)
                    events = [event]
                  } else if (minMoment.isSame(event.start)) {
                    events.push(event)
                  }
                } else {
                  minMoment = Moment(event.start)
                  events = [event]
                }
              }
            }
            message.channel.send(eventsToString(events))
          })

    }
  } else if (messageArray.length >= 2 && messageArray[0] === '!today') {
    if (messageArray.length === 2) {
      messageArray.push('')
    }
    if (Config.master['2'].info.specialities.indexOf(messageArray[1]) !== -1) {
      ical.fromURL(
          Ressource.createURL(
              Ressource.getId('master', 2, 'info', 1, messageArray[1]), today),
          {},
          function(err, data) {
            var events = []

            for (var k in data) {
              var event = data[k]

              if (Moment().isSame(event.start, 'day')) {
                if (messageArray[2] !== 'left' ||
                    Moment().isBefore(event.start)) {
                  events.push(event)
                }
              }
            }
            message.channel.send(eventsToString(events, true))
          })
    }
  } else if (messageArray.length === 2 && messageArray[0] === '!tomorrow') {
    if (Config.master['2'].info.specialities.indexOf(messageArray[1]) !== -1) {
      ical.fromURL(
          Ressource.createURL(
              Ressource.getId('master', 2, 'info', 1, messageArray[1]), 1),
          {},
          function(err, data) {
            var events = []

            for (var k in data) {
              var event = data[k]

              if (Moment().add(1, 'd').isSame(event.start, 'day')) {
                events.push(event)
              }
            }

            message.channel.send(eventsToString(events, true))
          })
    }
  } else if (messageArray.length === 2 && messageArray[0] === '!link') {
    if (Config.master['2'].info.specialities.indexOf(messageArray[1]) !== -1) {
      message.channel.send('https://planning-ade.umontpellier.fr/direct/index.jsp?&login=visuFDS&password=12345678&showTree=true&resources=' +
          Ressource.getId('master', 2, 'info', 1, messageArray[1]) +
          '&projectId=54')
    }
  } else if (messageArray[0] === '!help') {
    message.channel.send('**Commandes** : \n' +
        '`!now !next !today !tomorrow !link`\n\n' +
        '**Specialities**\n' +
        '`[info | aigle | decol | imagina | mit | msi]`\n\n' +
        '`!now` displays the information of the actuals classes\n' +
        '  _usage_ : `!now <speciality>`\n\n' +
        '`!next` displays the informations of the folowwing classes\n' +
        '  _usage_ : `!next <speciality>`\n\n' +
        '`!today` displays today\'s classes\n' +
        '  _usage_ : `!today <speciality> [left]`\n\n' +
        '`!tomorrow`  displays tomorrow\'s classes\n' +
        '  _usage_ : `!tomorrow <speciality>`\n\n' +
        '`!link` : creates a link to the original EDT for the wanted speciality\n' +
        '  _usage_ : `link <speciality>`')
  }
})

bot.login('MzU3MjMzMzk4NjcyMjYxMTIw.DJnISg.70tqAA5dx8SKiFHFrp8HTnFZkjA')

function eventsToString(events, short) {
  if (Array.isArray(events)) {
    events.sort(function(a, b) {
      if (Moment(a.start).isBefore(b.start)) {
        return -1
      } else if (Moment(a.start).isAfter(b.start)) {
        return 1
      }

      return 0
    })

    short = typeof short !== 'undefined' ? short : false
    var str = ''
    if (short) {
      str = '```markdown\n'
    } else {
      str = '```diff\n'
    }

    for (var key in events) {
      var event = events[key]
      if (!short) {
        str += '!======[' + event.summary + ']======!\n' +
            '+ ' + Moment(event.start).calendar() + ' -- ' +
            Moment(event.end).calendar() + '\n' +
            '- ' + event.location + '\n' +
            event.description + '\n'
      } else {
        str += '**' + event.summary + '** ' +
            Moment(event.start).format('HH:mm') + ' -- ' +
            Moment(event.end).format('HH:mm') + '\n' +
            '> ' + event.location + '\n'
      }
    }

    if (short) {
      return str + '\n```'
    }
    return str + '!=====================!\n```'
  }
  return ''
}