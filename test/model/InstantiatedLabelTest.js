const expect = require('chai').expect;

const Label = require('../../lib/model/Label');
const InstantiatedLabel = require('../../lib/model/InstantiatedLabel');

describe('InstantiatedLabel', function() {
    var label;
    beforeEach(function() {
        label = new Label('action');
    });

    describe('constructor', function() {
        it('sets the given label, data and metadata', function() {
            label.addParameter('param');
            var ilabel = new InstantiatedLabel(label, {param: 'value2'}, {meta: 'metavalue'});

            expect(ilabel.label).to.equal(label);
            expect(ilabel.data).to.have.property('param', 'value2');
            expect(ilabel.metadata).to.have.property('meta', 'metavalue');
        });

        it('sets the timestamp on the metadata', function() {
            var ilabel = new InstantiatedLabel(label, {}, {meta: 'metavalue'});
            expect(ilabel.metadata).to.have.property('timestamp');
        });

        it('allows missing label parameters in the data', function() {
            label.addParameter('param1');
            label.addParameter('param2');
            var ilabel = new InstantiatedLabel(label, {'param2': 'value'});
            expect(ilabel.data).to.eql({'param2': 'value'});
        });

        it('removes label parameters in the data without a value', function() {
            label.addParameter('param1');
            label.addParameter('param2');
            var ilabel = new InstantiatedLabel(label, {'param2': null, 'param1': ''});
            expect(ilabel.data).to.eql({});
        });

        it('throws an error if unknown label parameters are given', function() {
            label.addParameter('param');
            expect(function() {
                return new InstantiatedLabel(label, {'invalid': 'value'});
            }).to.throw(/unknown label parameter 'invalid'/);
        });
    });

    describe('.fromJSON', function() {
        it('instantiates from a JSON object', function() {
            label.addParameter('param');
            var ilabel = new InstantiatedLabel(
                label,
                {param: 'value2'},
                {meta: 'metavalue'}
            );
            var json = ilabel.toJSON();

            var outputIlabel = InstantiatedLabel.fromJSON(json);
            expect(outputIlabel).to.eql(ilabel);
        });
    });

    describe('#toJSON', function() {
        it('returns a JSON object', function() {
            label.addParameter('param');
            var ilabel = new InstantiatedLabel(
                label,
                {param: 'value2'},
                {meta: 'metavalue'}
            );

            var json = ilabel.toJSON();
            expect(json._label).to.eql({
                _id: 'action',
                _name: 'action',
                _parameters: ['param'],
                _quiescence: false,
                _response: false
            });
            expect(json._data).to.eql({param: 'value2'});
            expect(json._metadata.meta).to.equal('metavalue');
        });
    });
});
