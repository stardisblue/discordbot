const moment = require('moment-timezone')

var EventWrapper = function(unformattedEvent) {
  var descriptionArray = unformattedEvent.description.split('\n')
  descriptionArray = descriptionArray.filter(function(n) {
    return n !== ''
  })

  this.name = ''
  this.code = unformattedEvent.summary
  this.location = unformattedEvent.location
  this.start = unformattedEvent.start
  this.end = unformattedEvent.end

  this.specialities = []
  for (var k in descriptionArray) {
    var line = descriptionArray[k]

    if (line.substr(0, this.code.length) === this.code) {
      this.name = line.replace(this.code, '').trim()
    } else {
      var specArr = line.split('-')
      if (specArr.length > 1) {
        this.specialities.push(specArr[1].replace(this.code, '').trim())
      }
    }
  }

  this.specialities.sort()

}

EventWrapper.prototype.toString = function() {
  return '![' + this.code + '] ' + this.name + '\n' +
      '+ ' + moment(this.start).calendar() + ' à ' +
      moment(this.end).format('HH:mm') + '\n' +
      '% ' + this.location + '\n' +
      '  ' + this.specialities.join(', ') + '\n\n'
}

EventWrapper.prototype.shortEmbed = function() {
  return {
    'name': '[' + this.code + '] ' + this.name,
    'value': ':date: ' + moment(this.start).calendar() + ' à ' +
    moment(this.end).format('HH:mm') + '\n:school: ' + this.location +
    '\n\t\t #`' + this.specialities.join(', ') + '`',
  }
}

EventWrapper.prototype.embed = function() {
  return {
    'name': '[' + this.code + '] ' + this.name,
    'value': ':calendar_spiral: ' + moment(this.start).calendar() + ' à ' +
    moment(this.end).format('HH:mm') + '\n:school: ' + this.location +
    '\n\t\t #`' + this.specialities.join(', ') + '`',
  }
}
module.exports = EventWrapper