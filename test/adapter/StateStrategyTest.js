const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

const StateStrategy = require('../../lib/adapter/StateStrategy');

const Driver = require('../TestDriver');
const Element = require('../TestElement');


describe('StateStrategy', function() {
    var driver;
    beforeEach(function() {
        driver = new Driver();
    });

    describe('#fromUrl', function() {
        it('returns the url without query parameters and anchors (anything behind ?, & or #)', async function() {
            driver.currentUrl = 'http://www.mypage.com?q=3&p=4#h';
            expect(await new StateStrategy(driver).fromUrl()).to.equal('http://www.mypage.com');

            driver.currentUrl = 'mypage.com';
            expect(await new StateStrategy(driver).fromUrl()).to.equal('mypage.com');

            driver.currentUrl = 'http://asdf#234.com';
            expect(await new StateStrategy(driver).fromUrl()).to.equal('http://asdf');
        });
    });

    describe('#fromSelector', function() {
        it('returns the number of elements with the given selector', async function() {
            sinon.stub(driver, 'findElements').resolves([new Element(1), new Element(2)]);

            // we totally ignore the passed selector now
            expect(await new StateStrategy(driver).numberOfElements('.x')).to.equal(2);
        });
    });
});
