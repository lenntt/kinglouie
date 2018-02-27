const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(sinonChai);
const expect = chai.expect;

const Driver = require('../../TestDriver');
const Element = require('../../TestElement');
const RandomClick = require('../../../lib/adapter/actions/RandomClick');

describe('RandomClick', function() {
    var driver;
    var clicker;
    beforeEach(function() {
        driver = new Driver();

        clicker = new RandomClick(driver, {timeout: 100});
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

        it('randomly clicks one of the elements', async function() {
            sinon.stub(driver, 'findElements').resolves([element1, element2]);

            for (var i = 0; i < 100; i++) {
                await clicker.execute();
            }

            // Chances are really really high both elements are clicked by now
            expect(element1Click).to.have.been.called;
            expect(element2Click).to.have.been.called;
        });

        it('returns data of the element it clicked', async function() {
            sinon.stub(driver, 'findElements').resolves([element1]);

            var data = await clicker.execute();

            expect(data).to.eql({
                id: 'id1',
                class: 'class1',
                text: 'text1',
                label: 'aria-label1'
            });
        });

        it('retries a click on another element when a click fails', async function() {
            // To avoid shuffle randomness, use the same element twice
            element1Click.onFirstCall().throws('clicking failed');

            sinon.stub(driver, 'findElements')
                .onFirstCall().resolves([element1, element1]);

            var data = await clicker.execute();
            expect(data).to.have.property('id', 'id1');
        });

        it('retries a click on another element when the element is not enabled or displayed', async function() {
            this.skip();
        });

        it('retries finding all elements when the first time all elements fail', async function() {
            element1Click.throws('clicking failed');
            sinon.stub(driver, 'findElements')
                .onFirstCall().resolves([element1])
                .onSecondCall().resolves([element2]);

            await clicker.execute();

            expect(element2Click).to.have.been.called;
        });

        it('throws if nothing can be clicked within the timeout', async function() {
            sinon.stub(driver, 'findElements').resolves([]);

            expect(clicker.execute()).to.be.rejectedWith(/no clickable elements found/);
        });

        describe('reclick stategies and marking elements', function() {
            // TODO: a lot of work to get this unit tested
            it('decorates the element it clicks with a color - both for visual aid and detect already clicked elemens', async function() {
                this.skip();
            });

            it('tries not to click the same element twice', async function() {
                this.skip();
            });

            it('clicks the same element again if there are no other (unclicked) elements, start applying a different color', async function() {
                this.skip();
            });
        });
    });
});
