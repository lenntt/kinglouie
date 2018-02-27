const expect = require('chai').expect;

const Trace = require('../lib/model/Trace');
const Label = require('../lib/model/Label');
const InstantiatedLabel = require('../lib/model/InstantiatedLabel');

class TestApp {
    async preamble(driver) {
        expect(driver).to.be.ok;

        var label = Label.stimulus('preamble');
        var ilabel = new InstantiatedLabel(label);
        var trace = new Trace();
        trace.add(ilabel);

        return trace;
    }

    async waitForOutput(driver) {
        expect(driver).to.be.ok;

        var label = Label.response('output');
        var ilabel = new InstantiatedLabel(label);
        var trace = new Trace();
        trace.add(ilabel);

        return trace;
    }

    async determineState(driver) {
        expect(driver).to.be.ok;

        return 'determinedState';
    }
}

module.exports = TestApp;
