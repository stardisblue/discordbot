const EventWrapper = require('./event-wrapper')
const Resource = require('./resource')
const Config = require('../config')
const moment = require('moment-timezone')

var EventFactory = function() {

}

EventFactory.import = function(data) {
  var events = []

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      events.push(new EventWrapper(data[key]))
    }
  }
  events.sort(function(a, b) {
    if (moment(a.start).isBefore(b.start)) {
      return -1
    } else if (moment(a.start).isAfter(b.start)) {
      return 1
    }

    return 0
  })
  return events
}

EventFactory.format = function(events, speciality) {
  if (Array.isArray(events)) {
    if (events.length === 0) {
      return '`nothing`'
    }

    var fields = []

    events.forEach(function(event) {
        fields.push(event.embed())
    })

    return {
      'embed': {
        'title': ':link: EDT ' + speciality.toUpperCase(),
        'url': Config.planning + '&resources=' +
        Resource.getId('master2', 'info', 1, speciality),
        'color': 255,
        'timestamp': moment(),
        'footer': {
          'text': 'EDT Bot by stardisblue',
        },
        'fields': fields,
      },
    }
  }
  return ''
}

EventFactory.filter = function(events, filter) {

  filteredEvents = []
  for (var k  in events) {
    if (events.hasOwnProperty(k)) {
      var event = events[k]

      if (filter(event)) {
        filteredEvents.push(event)
      }
    }
  }

  return filteredEvents
}

module.exports = EventFactory