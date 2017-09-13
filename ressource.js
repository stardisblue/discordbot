var Config = require('./config')
var polyfill = require('./polyfill')

function Ressource() {
}

Ressource.defaultURL = Config.url + 'projectId=' +
    Config.projectId + '&calType=ical'

Ressource.createURL = function(ressources, nbWeeks) {
  if (Number.isInteger(ressources))
    return this.defaultURL + '&resources=' + ressources + '&nbWeeks=' + nbWeeks
  if (Array.isArray(ressources))
    return this.defaultURL + '&resources=' + ressources.join() +
        '&nbWeeks=' + nbWeeks
}

Ressource.getId = function(formation, departement, semester, speciality) {
  return Config[formation][departement]['semesters'][semester][speciality]
}

module.exports = Ressource