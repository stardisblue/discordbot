var Moment = require('moment-timezone')

var EventDecorator = function() {
}

EventDecorator.toString = function(event) {
  var info = EventDecorator.extract(event)
  return '![' + event.summary + '] ' + info.name + '\n' +
      '+ ' + Moment(event.start).calendar() + ' à ' +
      Moment(event.end).format('HH:mm') + '\n' +
      '% ' + event.location + '\n' +
      '  ' + info.specialities.join(', ') + '\n\n'
}

EventDecorator.summary = function(event) {
  return '#  [' + event.summary + '] ' + EventDecorator.extract(event).name +
      '\n' +
      Moment(event.start).format('HH:mm') + ' - ' +
      Moment(event.end).format('HH:mm') +
      ' > ' + event.location + '\n\n'
}

EventDecorator.extract = function(event) {

  var descriptionArray = event.description.split('\n')
  descriptionArray = descriptionArray.filter(function(n) {
    return n !== ''
  })

  var name = ''
  var options = []
  for (var k in descriptionArray) {
    var line = descriptionArray[k]

    if (line.substr(0, event.summary.length) === event.summary) {
      name = line.replace(event.summary, '').trim()
    } else {
      var specArr = line.split('-')
      if (specArr.length > 1) {
        options.push(specArr[1].replace(event.summary, '').trim())
      }
    }
  }

  options.sort()
  return {'specialities': options, 'name': name}

}

EventDecorator.format = function(events, style) {
  if (Array.isArray(events)) {
    events.sort(function(a, b) {
      if (Moment(a.start).isBefore(b.start)) {
        return -1
      } else if (Moment(a.start).isAfter(b.start)) {
        return 1
      }

      return 0
    })

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
        str += EventDecorator.summary(event)
      } else {
        str += EventDecorator.toString(event)
      }
    }

    return str + '```'
  }
  return ''
}

module.exports = EventDecorator