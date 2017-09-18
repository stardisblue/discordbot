const CalendarEvent = require('./event-wrapper')
const Moment = require('moment-timezone')


var EventFactory = function () {

}

EventFactory.import = function (data) {
    var events = []

    data.forEach(function (element) {
        events.push(new CalendarEvent(element))
    })

    events.sort(function (a, b) {
        if (Moment(a.start).isBefore(b.start)) {
            return -1
        } else if (Moment(a.start).isAfter(b.start)) {
            return 1
        }

        return 0
    })

    return events
}

EventFactory.format = function (events, style) {
    if (Array.isArray(events)) {
        if (events.length === 0) {
            return '`nothing`'
        }

        var str = ''
        if (style === 'short') {
            str = '```markdown\n'
        } else {
            str = '```diff\n'
        }

        for (var key in events) {
            var event = events[key]
            if (style === 'short') {
                str += event.summary()
            } else {
                str += event.toString()
            }
        }

        return str + '```'
    }
    return ''
}

EventFactory.filter = function (events, filter) {

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