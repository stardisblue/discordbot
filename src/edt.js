const ical = require('ical')
const moment = require('moment-timezone')

const Config = require('../config')
const Resource = require('./resource')
const EventFactory = require('./event-factory')

var edt = function() {
  this.currentDay = 0
}

edt.now = function(message, args) {
  if (args.length !== 2) {
    message.channel.send('`incorrect number of arguments`')
    return
  }

  if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
    message.channel.send(args[1] + ' is not in the list')
    return
  }

  ical.fromURL(
      Resource.createURL(
          Resource.getId('master2', 'info', 1, args[1]), 0),
      {},
      function(err, data) {
        var unfilteredEvents = EventFactory.import(data)

        var events = EventFactory.filter(unfilteredEvents, function(event) {
          return moment().isBetween(moment(event.start), moment(event.end))
        })

        message.channel.send(EventFactory.format(events, args[1]))
      })

}

edt.next = function(message, args) {
  if (args.length !== 2) {
    message.channel.send('`incorrect number of arguments`')
    return
  }

  if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
    message.channel.send(args[1] + ' is not in the list')
    return
  }

  ical.fromURL(
      Resource.createURL(
          Resource.getId('master2', 'info', 1, args[1]), 2),
      {},
      function(err, data) {
        var allEvents = EventFactory.import(data)
        var events = []
        var minMoment

        for (var key in allEvents) {
          var event = allEvents[key]

          if (moment().isBefore(event.start)) {
            if (minMoment !== undefined) {
              if (minMoment.isAfter(event.start)) {
                minMoment = moment(event.start)
                events = [event]
              } else if (minMoment.isSame(event.start)) {
                events.push(event)
              }
            } else {
              minMoment = moment(event.start)
              events = [event]
            }
          }
        }
        message.channel.send(EventFactory.format(events, args[1]))
      })
}

edt.today = function(message, args) {
  if (args.length < 2) {
    message.channel.send('`incorrect number of arguments`')
    return
  }

  if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
    message.channel.send(args[1] + ' is not in the list')
    return
  }

  if (args.length === 2) {
    args.push('')
  }

  ical.fromURL(
      Resource.createURL(
          Resource.getId('master2', 'info', 1, args[1]), 0),
      {},
      function(err, data) {
        var unfilteredEvents = EventFactory.import(data)
        var events = EventFactory.filter(unfilteredEvents, function(event) {
          if (moment().isSame(event.start, 'day')) {
            if (args[2] !== 'left' || moment().isBefore(event.start)) {
              return true
            }
          }
          return false
        })

        message.channel.send(EventFactory.format(events, args[1]))
      })
}

edt.tomorrow = function(message, args) {
  if (args.length !== 2) {
    message.channel.send('`incorrect number of arguments`')
    return
  }

  if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
    message.channel.send(args[1] + ' is not in the list')
    return
  }

  ical.fromURL(
      Resource.createURL(
          Resource.getId('master2', 'info', 1, args[1]), 1),
      {},
      function(err, data) {
        var unfilteredEvents = EventFactory.import(data)
        var events = EventFactory.filter(unfilteredEvents, function(event) {
          return moment().add(1, 'd').isSame(event.start, 'day')
        })

        message.channel.send(EventFactory.format(events, args[1]))
      })

}

edt.link = function(args) {
  if (args.length !== 2) {
    return '`incorrect number of arguments`'
  }

  if (Config.master2.info.specialities.indexOf(args[1]) === -1) {
    return args[1] + ' is not in the list'
  }

  return Config.planning + '&resources=' +
      Resource.getId('master2', 'info', 1, args[1])

}

edt.help = function() {
  return '**Commandes** : \n' +
      '`!now !next !today !tomorrow !link`\n\n' +
      '**Specialities** : `info`, `aigle`, `decol`, `imagina`, `mit`, `msi`\n\n' +
      '`!now` displays the information of the actuals classes\n' +
      '  _usage_ : `!now <speciality>`\n\n' +
      '`!next` displays the information of the following classes\n' +
      '  _usage_ : `!next <speciality>`\n\n' +
      '`!today` displays today\'s classes\n' +
      '  _usage_ : `!today <speciality> [left]`\n\n' +
      '`!tomorrow`  displays tomorrow\'s classes\n' +
      '  _usage_ : `!tomorrow <speciality>`\n\n' +
      '`!link` : creates a link to the original EDT for the wanted speciality\n' +
      '  _usage_ : `link <speciality>`'
}

module.exports = edt