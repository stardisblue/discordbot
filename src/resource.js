var Config = require('../config')
var polyfill = require('./polyfill')

function Resource() {
}

Resource.defaultURL = Config.url + 'projectId=' +
    Config.projectId + '&calType=ical'

Resource.createURL = function(resources, nbWeeks) {
  if (Number.isInteger(resources))
    return this.defaultURL + '&resources=' + resources + '&nbWeeks=' + nbWeeks
  if (Array.isArray(resources))
    return this.defaultURL + '&resources=' + resources.join() +
        '&nbWeeks=' + nbWeeks
}

Resource.getId = function(formation, department, semester, speciality) {
  return Config[formation][department]['semesters'][semester][speciality]
}

module.exports = Resource