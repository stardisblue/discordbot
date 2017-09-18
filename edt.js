const ical = require('ical')
const moment = require('moment-timezone')

const Config = require('./config')
const Ressource = require('./ressource')
const EventFactory = require('./event-factory')


var edt = function () {
    this.currentDay = 0
}

edt.now = function (args) {
    if (args.length !== 2) {
        return '`incorrect number of arguments`'

    }

    if (Config.master2.info.specialities.indexOf(args[1]) !== -1) {
        return ical.fromURL(
            Ressource.createURL(
                Ressource.getId('master2', 'info', 1, args[1]), this.currentDay),
            {},
            function (err, data) {
                var unfilteredEvents = EventFactory.import(data)

                var events = EventFactory.filter(unfilteredEvents, function (event) {
                    return moment().isBetween(moment(event.start), moment(event.end))
                })

                return EventFactory.format(events)
            })
    }
}

edt.next = function (args) {
    if (args.length !== 2) {
        return '`incorrect number of arguments`'
    }

    if (Config.master2.info.specialities.indexOf(args[1]) !== -1) {

        return ical.fromURL(
            Ressource.createURL(
                Ressource.getId('master2', 'info', 1, args[1]), 2),
            {},
            function (err, data) {
                var allEvents = EventFactory.import(data)
                var events = []
                var minMoment

                for (var key in allEvents) {
                    var event = allEvents[key]

                    if (moment().isBefore(event.start)) {
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

                return EventFactory.format(events)
            })

    }
}

edt.today = function (args) {
    if (args.length < 2) {
        return '`incorrect number of arguments`'
    }

    if (args.length === 2) {
        args.push('')
    }

    if (Config.master2.info.specialities.indexOf(args[1]) !== -1) {
        return ical.fromURL(
            Ressource.createURL(
                Ressource.getId('master2', 'info', 1, args[1]), this.currentDay),
            {},
            function (err, data) {
                var unfilteredEvents = EventFactory.import(data)
                var events = EventFactory.filter(unfilteredEvents, function (event) {
                    if (moment().isSame(event.start, 'day')) {
                        if (args[2] !== 'left' || moment().isBefore(event.start)) {
                            return true
                        }
                    }
                    return false
                })

                return EventFactory.format(events, 'short')
            })
    }
}

edt.tomorrow = function (args) {
    if (args.length !== 2) {
        return '`incorrect number of arguments`'
    }

    if (Config.master2.info.specialities.indexOf(args[1]) !== -1) {
        return ical.fromURL(
            Ressource.createURL(
                Ressource.getId('master2', 'info', 1, args[1]), 1),
            {},
            function (err, data) {
                var unfilteredEvents = EventFactory.import(data)
                var events = EventFactory.filter(unfilteredEvents, function (event) {
                    return moment().add(1, 'd').isSame(event.start, 'day')
                })

                return EventFactory.format(events, 'short')
            })
    }
}

edt.link = function (message, args) {
    if (args.length !== 2) {
        return '`incorrect number of arguments`'
    }

    if (Config.master2.info.specialities.indexOf(args[1]) !== -1) {
        return Config.planning + '&resources=' +
            Ressource.getId('master2', 'info', 1, args[1])
    }
}

edt.help = function () {
    return '**Commandes** : \n' +
        '`!now !next !today !tomorrow !link`\n\n' +
        '**Specialities** : `info`, `aigle`, `decol`, `imagina`, `mit`, `msi`\n\n' +
        '`!now` displays the information of the actuals classes\n' +
        '  _usage_ : `!now <speciality>`\n\n' +
        '`!next` displays the informations of the folowwing classes\n' +
        '  _usage_ : `!next <speciality>`\n\n' +
        '`!today` displays today\'s classes\n' +
        '  _usage_ : `!today <speciality> [left]`\n\n' +
        '`!tomorrow`  displays tomorrow\'s classes\n' +
        '  _usage_ : `!tomorrow <speciality>`\n\n' +
        '`!link` : creates a link to the original EDT for the wanted speciality\n' +
        '  _usage_ : `link <speciality>`'
}

module.exports = edt