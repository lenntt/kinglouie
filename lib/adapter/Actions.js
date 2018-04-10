const expect = require('chai').expect;

const ElementData = require('./ElementData');

const Click = require('./actions/Click');

const InstantiatedLabel = require('../model/InstantiatedLabel');

class Actions {
    static fromILabel(driver, app, ilabel) {
        expect(ilabel).to.be.an.instanceof(InstantiatedLabel);
        expect(ilabel.label.response).to.be.false;

        // TODO: reduce nasty couply by getting names from Labels
        switch (ilabel.label.name) {
            case '?click':
                return new Click(
                    driver,
                    ElementData.fromILabel(ilabel).toSelector()
                );
            case '?preamble':
                return app.preamble;
            default:
                throw new Error(`Unknown label: ${ilabel.label.name}`);
        }
    }
}

module.exports = Actions;
