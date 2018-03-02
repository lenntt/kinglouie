const expect = require('chai').expect;

const Model = require('../../../lib/model/Model');
const State = require('../../../lib/model/State');
const Label = require('../../../lib/model/Label');

describe('Model', function() {
    var startState;
    var state;
    var label;
    var model;

    beforeEach(function() {
        startState = new State('start');
        label = new Label('label');
        state = new State('state');
        model = new Model(startState);
    });

    describe('constructor', function() {
        it('sets the given state as the initialState', function() {
            expect(model.initialState).to.equal(startState);
        });

        it('has no labels initially', function() {
            expect(model.labels).to.be.empty;
        });

        it('has 1 state initially (the initial state)', function() {
            expect(model.states).to.have.lengthOf(1);
            expect(model.states[0]).to.equal(startState);
        });
    });

    describe('#getState', function() {
        it('returns the given state from the known states with the same id', function() {
            model.addState(state);

            expect(model.getState(state)).to.equal(state);
            expect(model.getState(new State('state'))).to.equal(state);
        });

        it('returns the given state by its name', function() {
            model.addState(state);

            expect(model.getState('state')).to.equal(state);
        });

        it('returns undefined if the given state is not known to the model', function() {
            expect(model.getState(state)).to.be.undefined;
            expect(model.getState('state')).to.be.undefined;
        });
    });

    describe('#addLabel', function() {
        it('adds the given state and returns it', function() {
            expect(model.addLabel(label)).to.equal(label);
            expect(model.labels).to.have.lengthOf(1);
        });

        it('does not add the label if a label with that id already exists and returns the original label', function() {
            var label1 = new Label('label');
            var label2 = new Label('label');
            expect(model.addLabel(label1)).to.equal(label1);
            expect(model.addLabel(label2)).to.equal(label1);
            expect(model.labels).to.have.lengthOf(1);
        });
    });

    describe('#addState', function() {
        it('adds the given state and returns it', function() {
            expect(model.addState(state)).to.equal(state);
            expect(model.states).to.have.lengthOf(2);
        });

        it('does not add the state if a state with that id already exists and returns the original state', function() {
            var state1 = new State('state');
            var state2 = new State('state');
            expect(model.addState(state1)).to.equal(state1);
            expect(model.addState(state2)).to.equal(state1);
            expect(model.states).to.have.lengthOf(2);
        });
    });

    describe('#addTransition', function() {
        it('adds the label and to state if not known to the model', function() {
            model.addTransition(startState, label, state);
            expect(model.labels).to.have.lengthOf(1);
            expect(model.states).to.have.lengthOf(2);
        });

        it('adds the transition to the state', function() {
            model.addTransition(startState, label, state);
            expect(startState.outs).to.have.lengthOf(1);
            expect(startState.outs[0].label).to.equal(label);
            expect(startState.outs[0].to).to.equal(state);
        });

        it('returns an existing transition if the from state already has an outgoing transition with the given label', function() {
            var transition = model.addTransition(startState, label, state);
            expect(model.addTransition(startState, label, state)).to.equal(transition);
            expect(startState.outs).to.have.lengthOf(1);
        });

        it('throws an error if the given from state is not in the model', function() {
            expect(function() {
                model.addTransition(state, label, state);
            }).to.throw(/from state 'state' is not known to the model/);
        });
    });

    describe('findPath', function() {
        describe('with a simple model, containing a single path', function() {
            it('returns the shortest path to the given state name', function() {
                var label1 = new Label('label1');
                var label2 = new Label('label2');
                var state2 = new State('state2');
                var transition1 = model.addTransition(startState, label1, state);
                var transition2 = model.addTransition(state, label2, state2);

                var path = model.findPath(state2);
                expect(path).to.eql([
                    transition1,
                    transition2
                ]);
            });
        });

        describe('with a model that has multiple paths to states, including loops', function() {
            it('returns the shortest path to the given state name', function() {
                var label1 = new Label('label1');
                var label2 = new Label('label2');
                var state2 = new State('state2');
                var state3 = new State('state3');
                var state4 = new State('state4');
                var state5 = new State('state5');

                // Label1 is a straight path towards state5
                var transition11 = model.addTransition(startState, label1, state);
                var transition12 = model.addTransition(state, label1, state2);
                model.addTransition(state2, label1, state3);
                model.addTransition(state3, label1, state4);
                var transition15 = model.addTransition(state4, label1, state5);
                model.addTransition(state5, label1, state5);

                // Label2 adds some trickery
                model.addTransition(startState, label2, startState);
                model.addTransition(state, label2, startState);
                var transition23 = model.addTransition(state2, label2, state4);
                model.addTransition(state3, label2, state);
                model.addTransition(state4, label2, state4);

                var path = model.findPath(state5);
                expect(path).to.eql([
                    transition11,
                    transition12,
                    transition23,
                    transition15
                ]);
            });
        });

        describe('when the model has an unreachable state', function() {
            it('return null if the given state is unreachable', function() {
                model.addState(state);

                var path = model.findPath(state);
                expect(path).to.be.null;
            });
        });
    });


    describe('#toDot', function() {
        // Compare multiline strings without bothering about leading/trailing whitespace
        function validateMultiline(str1, str2) {
            function cleanString(str) {
                return str.split('\n').map(function(line) {
                    return line.trim();
                }).filter(function(line) {
                    return line;
                });
            }

            var str1Lines = cleanString(str1);
            var str2Lines = cleanString(str2);
            expect(str1Lines).to.eql(str2Lines);
        }

        describe('without transitions', function() {
            it('returns a digraph with only the start edge and node', function() {
                validateMultiline(
                    model.toDot(),
                    `digraph {
                       "_initialState" [style="invisible"]
                       "_initialState" -> "start"
                    }`
                );
            });
        });

        describe('with some recursive transitions', function() {
            it('returns a digraph with the correct nodes and edges', function() {
                var label1 = new Label('label1');
                var label2 = new Label('label2');
                model.addTransition(startState, label1, state);
                model.addTransition(startState, label2, startState);
                model.addTransition(state, label1, startState);
                model.addTransition(state, label2, state);

                // Enable for debugging
                // require('../../lib/model/Visualizer').createHTML(model, './test.html');

                validateMultiline(
                    model.toDot(),
                    `digraph {
                        "_initialState" [style="invisible"]
                        "_initialState" -> "start"
                        "start" -> "state" [label="label1" color="black"]
                        "start" -> "start" [label="label2" color="black"]
                        "state" -> "start" [label="label1" color="black"]
                        "state" -> "state" [label="label2" color="black"]
                    }`
                );
            });
        });

        describe('with a transition that has label parameters', function() {
            it('returns a digraph with the correct nodes and edges', function() {
                var label1 = new Label('label1');
                label1.addParameter('param1');
                label1.addParameter('param2');

                model.addTransition(startState, label1, state, {'param1': 'value1', 'param2': 'value2'});

                // Enable for debugging
                // require('../../lib/model/Visualizer').createHTML(model, './test.html');

                validateMultiline(
                    model.toDot(),
                    `digraph {
                        "_initialState" [style="invisible"]
                        "_initialState" -> "start"
                        "start" -> "state" [label="label1\\nparam1 == value1\\nparam2 == value2" color="black"]
                    }`
                );
            });
        });
    });
});
