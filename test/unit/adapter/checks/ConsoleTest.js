const expect = require('chai').expect;
const webdriver = require('selenium-webdriver');
const Level = webdriver.logging.Level;

const Driver = require('../../../TestDriver');
const Console = require('../../../../lib/adapter/checks/Console');

describe('Console', function() {
    var driver;
    var check;
    beforeEach(function() {
        driver = new Driver();
        check = new Console(driver);
    });

    describe('#check', function() {
        describe('when allowMultiple is true and onError is true', function() {
            it('returns all messages of logs at level SEVERE', async function() {
                driver.logs = [
                    {level: 'INFO', message: 'other message'},
                    {level: Level.SEVERE, message: 'my message'}
                ];
                var trace = await check.check();
                expect(trace).to.have.lengthOf(1);
                expect(trace[0].label.name).to.equal('!error_console');
                expect(trace[0].data).to.have.property('message', 'my message');
            });

            it('returns an empty list if there are no errors', async function() {
                var trace = await check.check();
                expect(trace).to.be.empty;
            });
        });
    });
});
