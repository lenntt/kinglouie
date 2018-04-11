const chai = require('chai');
const expect = chai.expect;

const Actions = require('../../../lib/adapter/Actions');

const ILabels = require('../../../lib/adapter/ILabels');
const ElementData = require('../../../lib/adapter/ElementData');
const Click = require('../../../lib/adapter/actions/Click');

const TestApp    = require('../../TestApp');
const TestDriver = require('../../TestDriver');

describe('Actions', function() {
    var app;
    var driver;

    beforeEach(function() {
        app = new TestApp();
        driver = new TestDriver();
    });

    describe('fromILabel', function() {
        it('returns an instantiated click action with selector if label is click', function() {
            var elementData = new ElementData('text', 'id', 'class', 'label');
            var ilabel = ILabels.click(elementData);
            var action = Actions.fromILabel(driver, app, ilabel);
            expect(action).to.be.an.instanceof(Click);
            expect(action.selector.toString()).to.equal("By(xpath, //*[contains(@class, 'class') and @id='id') and text()='text' and @aria-label='label'])");
        });

        it('returns the app preamble method if label is premble', function() {
            var ilabel = ILabels.preamble();
            expect(Actions.fromILabel(driver, app, ilabel)).to.have.property('execute', app.preamble);
        });

        it('throws at any other label', function() {
            var ilabel = ILabels.quiescence();
            expect(function() {
                Actions.fromILabel(driver, app, ilabel);
            }).to.throw(/Unknown label/);
        });
    });
});
