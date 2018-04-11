const chai = require('chai');
const expect = chai.expect;

const ElementData = require('../../../lib/adapter/ElementData');

const ILabels = require('../../../lib/adapter/ILabels');

const Element = require('../../TestElement');

describe('ElementData', function() {
    var elementData;
    beforeEach(function() {
        elementData = new ElementData('myText', 'myId', 'myClass', 'myLabel');
    });

    describe('#toLabelData', function() {
        it('returns a simplified object', function() {
            var labelData = elementData.toLabelData();
            expect(labelData).to.eql({
                'text': 'myText',
                'id': 'myId',
                'className': 'myClass',
                'label': 'myLabel'
            });
        });
    });

    describe('#toSelector', function() {
        it('returns an xpath selector that represents the element', function() {
            var selector = elementData.toSelector();
            expect(selector.toString()).to.equal("By(xpath, //*[contains(@class, 'myClass') and @id='myId') and text()='myText' and @aria-label='myLabel'])");
        });
        it('returns an "any" selector if there is no usable data', function() {
            elementData = new ElementData();
            var selector = elementData.toSelector();
            expect(selector.toString()).to.equal('By(xpath, //*[])');
        });
    });

    describe('.fromWebElement (async)', function() {
        it('returns the ElementData from the WebElement', async function() {
            var element = new Element(1);
            elementData = await ElementData.fromWebElement(element);

            expect(elementData).to.have.property('id', 'id1');
            expect(elementData).to.have.property('className', 'class1');
            expect(elementData).to.have.property('text', 'text1');
            expect(elementData).to.have.property('label', 'aria-label1');
        });
    });

    describe('.fromIlabel', function() {
        it('returns ElementData from data on the ilabel', function() {
            elementData = ElementData.fromILabel(ILabels.click(elementData));
            expect(elementData).to.eql(elementData);

        });
        it('returns empty ElementData if the ilabel has no usable data', function() {
            elementData = ElementData.fromILabel(ILabels.quiescence());
            expect(elementData).to.eql(new ElementData());
        });
    });
});
