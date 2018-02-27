require('chromedriver');
const webdriver = require('selenium-webdriver');

const KingLouie = require('../../lib/KingLouie');

const Trace = require('../../lib/model/Trace');

const StateStrategy = require('../../lib/adapter/StateStrategy');
const ILabels = require('../../lib/adapter/ILabels');
const ConsoleCheck = require('../../lib/adapter/checks/Console');
// const A11YCheck = require('../../lib/adapter/checks/A11Y');

const QUIESCENCE_TIMEOUT = 1000;

const app = {
    async preamble(driver) {
        var page = 'http://www.google.com';
        await driver.get(page);
        await new Promise(function(resolve) { setTimeout(resolve, QUIESCENCE_TIMEOUT); });

        var ilabel = ILabels.preamble(`go to ${page}`);
        var trace = new Trace();
        trace.add(ilabel);

        return Promise.resolve(trace);
    },

    async waitForOutput(driver) {
        await new Promise(function(resolve) { setTimeout(resolve, QUIESCENCE_TIMEOUT); });

        var outputTrace = await new ConsoleCheck(driver).check();
        // outputTrace.concat(await new A11YCheck(driver).check());

        return Promise.resolve(outputTrace);
    },

    async determineState(driver) {
        return await new StateStrategy(driver).fromUrl();
    }
};

function main() {
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

    var kinglouie = new KingLouie(driver, app);
    kinglouie.loadTraces();

    console.log(kinglouie.findPath('https://www.google.com/services/'));

    console.log('"Finished successfully');

    driver.quit();
}

main();
