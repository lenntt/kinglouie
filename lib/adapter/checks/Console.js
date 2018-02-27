const expect = require('chai').expect;

const webdriver = require('selenium-webdriver');
const Level = webdriver.logging.Level;

const ILabels = require('../ILabels');

const Trace = require('../../model/Trace');

class ConsoleCheck {
    constructor(driver, config = {onError: true, allowMultiple: true}) {
        this._driver = driver;

        expect(config).to.have.own.property('onError', true, 'unsupported config');
        expect(config).to.have.own.property('allowMultiple', true, 'unsupported config');
        this._config = config;
    }

    async check() {
        const logEntries = await this._driver.manage().logs().get('browser');
        var ilabels = logEntries.filter(function(entry) {
            return entry.level === Level.SEVERE;
        }).map(function(entry) {
            return ILabels.errorConsole(entry.message);
        });
        return Trace.fromArray(ilabels);
    }
}

module.exports = ConsoleCheck;
