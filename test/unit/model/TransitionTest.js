const expect = require('chai').expect;

const Label = require('../../../lib/model/Label');
const State = require('../../../lib/model/State');
const Transition = require('../../../lib/model/Transition');

describe('Transition', function() {
    var label;
    var state1;
    var state2;
    var transition;

    beforeEach(function() {
        label = new Label('action');
        state1 = new State('state1');
        state2 = new State('state2');
        transition = new Transition(state1, label, state2);
    });

    describe('constructor', function() {
        it('sets the given from, label and to', function() {
            expect(transition.from).to.equal(state1);
            expect(transition.label).to.equal(label);
            expect(transition.to).to.equal(state2);
        });

        it('has no guard initially', function() {
            expect(transition.guard).to.be.empty;
        });
    });

    describe('#addCondition', function() {
        it('updates the guard', function() {
            transition.addCondition('param', 'value');
            expect(transition.guard).to.have.property('param', 'value');
        });
    });
});
