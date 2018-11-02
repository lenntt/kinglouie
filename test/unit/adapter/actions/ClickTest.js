const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(sinonChai);
const expect = chai.expect;

const Driver = require('../../../TestDriver');
const Element = require('../../../TestElement');
const Click = require('../../../../lib/adapter/actions/Click');

describe('Click', function() {
    var driver;
    var clicker;
    var selector;
    beforeEach(function() {
        driver = new Driver();
        selector = 'mySelector';
        clicker = new Click(driver, selector, {timeout: 100});
    });

    describe('#execute (async)', function() {
        var element1, element2;
        var element1Click, element2Click;
        beforeEach(function() {
            element1 = new Element(1);
            element2 = new Element(2);
            element1Click = sinon.stub(element1, 'click');
            element2Click = sinon.stub(element2, 'click');
        });

        it('clicks the element with the given selector', async function() {
            sinon.stub(driver, 'findElement').withArgs(selector).resolves(element2);

            await clicker.execute();

            expect(element1Click).not.to.have.been.called;
            expect(element2Click).to.have.been.called;
        });

        it('tries again if the element is not clickable the first time', async function() {
            sinon.stub(driver, 'findElement').withArgs(selector).resolves(element1);

            sinon.stub(element1, 'isEnabled')
                .onFirstCall().resolves(false)
                .onSecondCall().resolves(true);

            await clicker.execute();

            expect(element1Click).to.have.been.called;

            expect(element1.isEnabled).to.have.been.calledTwice;
        });

        it('throws if selectors is not found within the timeout', async function() {
            sinon.stub(driver, 'findElement').withArgs(selector).resolves([]);

            expect(clicker.execute()).to.be.rejectedWith(/no clickable element for: mySelector/);
        });
    });
});
