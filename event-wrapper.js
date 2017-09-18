const Moment = require('moment-timezone')


var EventWrapper = function (unformattedEvent) {
    var descriptionArray = unformattedEvent.description.split('\n')
    descriptionArray = descriptionArray.filter(function (n) {
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

EventWrapper.prototype.toString = function () {
    return '![' + this.code + '] ' + this.name + '\n' +
        '+ ' + Moment(this.start).calendar() + ' à ' +
        Moment(this.end).format('HH:mm') + '\n' +
        '% ' + this.location + '\n' +
        '  ' + this.specialities.join(', ') + '\n\n'
}

EventWrapper.prototype.summary = function () {
    return '#  [' + this.code + '] ' + this.name + '\n' +
        Moment(this.start).format('HH:mm') + ' - ' +
        Moment(this.end).format('HH:mm') +
        ' > ' + this.location + '\n\n'
}

module.exports = EventWrapper