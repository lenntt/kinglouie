const expect = require('chai').expect;

const Label = require('../../../lib/model/Label');
const Transition = require('../../../lib/model/Transition');
const State = require('../../../lib/model/State');

describe('State', function() {
    var state;
    beforeEach(function() {
        state = new State('state');
    });

    describe('constructor', function() {
        it('sets the given name and id', function() {
            expect(state.name).to.equal('state');
            expect(state.id).to.equal('state');
        });

        it('has no outs initially', function() {
            expect(state.outs).to.be.empty;
        });
    });

    describe('#getTransitionFor', function() {
        var label;
        beforeEach(function() {
            label = new Label('label');
        });

        it('returns the outgoing transition with the given label', function() {
            var transition = new Transition(state, label, state);
            state.registerTransition(transition);
            expect(state.getTransitionFor(label)).to.equal(transition);
        });

        it('returns null if the given label is not in the states outs', function() {
            expect(state.getTransitionFor(label)).to.be.undefined;
        });

        describe('when there are different transitions with the same label but different guard', function() {
            it('returns the transition with the same label and guard', function() {
                var transition1 = new Transition(state, label, state, {'param': 'value1'});
                var transition2 = new Transition(state, label, state, {'param': 'value2'});
                state.registerTransition(transition1);
                state.registerTransition(transition2);

                expect(state.getTransitionFor(label, {'param': 'value1'})).to.equal(transition1);
                expect(state.getTransitionFor(label, {'param': 'value2'})).to.equal(transition2);
            });
        });
    });
});
