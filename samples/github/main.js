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
        var page = 'https://github.com/';
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
        // outputTrace.addAll(await new A11YCheck(driver).check());

        return Promise.resolve(outputTrace);
    },

    async determineState(driver) {
        if (await new StateStrategy(driver).didLeavePage('github.com')) {
            return 'ExternalPage';
            // TODO: gracefully stop current swing
        }
        return await new StateStrategy(driver).fromUrl() + ':' +
            await new StateStrategy(driver).numberOfElements('a,button,.button,[role="button"],[role="link"],[role="menuitem"]');
    }
};

async function main() {
    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

    var kinglouie = new KingLouie(driver, app);
    console.log('Loading previous traces');
    kinglouie.loadTraces();
    // TEMP
    kinglouie.visualize('output/model.html');
    console.log(`Traces loaded: ${kinglouie.traces.length}`);

    console.log('Start Learning...');
    await kinglouie.swing({
        maxTraces: 3,
        maxDepth: 5,
        saveImages: true
    });

    console.log('Finished learning. Saving traces and model...');
    kinglouie.saveTraces();
    kinglouie.visualize('output/model.html');

    driver.quit();
}

main();
