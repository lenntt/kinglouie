const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(sinonChai);

const expect = chai.expect;

const KingLouie = require('../lib/KingLouie');
const App = require('./TestApp');
const Driver = require('./TestDriver');

describe('KingLouie', function() {
    var driver;
    var app;
    var kinglouie;
    beforeEach(function() {
        driver = new Driver();
        app = new App();

        kinglouie = new KingLouie(driver, app);

        // I dont like touching privates :(
        sinon.stub(kinglouie._click, 'execute').returns({id: 'id', class: 'class', text: 'text', label: 'label'});
    });

    describe('constructor', function() {
        it('initializes with the given driver, app and traces', function() {
            var traces = [1, 2, 3];
            kinglouie = new KingLouie(driver, app, traces);
            expect(kinglouie.traces).to.equal(traces);
        });

        it('has no traces if none are given', function() {
            kinglouie = new KingLouie(driver, app);
            expect(kinglouie.traces).to.be.empty;
        });

        it('throws error when the given driver object is not a webdriver', function() {
            expect(function() {
                return new KingLouie({}, app);
            }).to.throw(/driver must be a WebDriver/);
        });

        it('throws error when the given app does not implemented the expected interface', function() {
            expect(function() {
                return new KingLouie(driver, {});
            }).to.throw(/app not correctly implemented/);
        });
    });

    describe('#swing (async)', function() {
        it('repeats capturing traces "config.maxTraces" times', async function() {
            await kinglouie.swing({maxTraces: 10});
            expect(kinglouie.traces).to.have.lengthOf(10);
        });

        it('starts every trace with the preamble', async function() {
            await kinglouie.swing({maxTraces: 10});
            for (var i = 0; i < kinglouie.traces; i++) {
                var trace = kinglouie.traces[i];
                expect(trace[0].label.name).to.equal('?preamble');
            }
        });

        it('always waits at least once for output', async function() {
            await kinglouie.swing({maxTraces: 1, maxDepth: 1});
            var trace = kinglouie.traces[0];
            expect(trace[0].label.name).to.equal('?preamble');
            expect(trace[1].label.name).to.equal('!output');
        });

        it('adds the determined state to the last ilabel in the trace', async function() {
            await kinglouie.swing({maxTraces: 1, maxDepth: 1});
            var trace = kinglouie.traces[0];
            expect(trace).to.have.lengthOf(2);
            expect(trace[1].label.name).to.equal('!output');
            expect(trace[1].metadata).to.have.own.property('state', 'determinedState');
        });
    });
});
