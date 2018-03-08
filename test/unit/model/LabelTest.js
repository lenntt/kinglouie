const expect = require('chai').expect;

const Label = require('../../../lib/model/Label');

describe('Label', function() {
    var label;
    beforeEach(function() {
        label = new Label('action');
    });

    describe('constructor', function() {
        it('sets the given name and id', function() {
            expect(label.name).to.equal('action');
            expect(label.id).to.equal('action');
        });

        it('has no label parameters initially', function() {
            expect(label.parameters).to.be.empty;
        });
    });

    describe('the basic label types', function() {
        describe('stimulus', function() {
            it('initializes a Label, that is not a response', function() {
                label = Label.stimulus('label');
                expect(label.name).to.equal('?label');
                expect(label.response).to.be.false;
                expect(label.quiescence).to.be.false;
            });
        });

        describe('response', function() {
            it('initializes a response Label and is not quiescence', function() {
                label = Label.response('label');
                expect(label.name).to.equal('!label');
                expect(label.response).to.be.true;
                expect(label.quiescence).to.be.false;
            });
        });

        describe('quiescence', function() {
            it('initializes a quiescence Label, that is not a response nor stimulus', function() {
                label = Label.quiescence('label');
                expect(label.name).to.equal('δ');
                expect(label.response).to.be.false;
                expect(label.quiescence).to.be.true;
            });
        });
    });

    describe('.fromJSON', function() {
        it('returns a label from the given JSON', function() {
            const json = {
                _id: 'action',
                _name: 'action',
                _parameters: ['param'],
                _quiescence: false,
                _response: false
            };
            label = Label.fromJSON(json);

            expect(label).to.have.property('name', 'action');
            expect(label.parameters).to.have.lengthOf(1);
            expect(label.parameters[0]).to.equal('param');
        });
    });

    describe('#addParameter', function() {
        it('adds a LabelParameter with the given parameters', function() {
            label.addParameter('param');
            expect(label.parameters).to.have.lengthOf(1);
            expect(label.parameters[0]).to.equal('param');
        });
    });
});
