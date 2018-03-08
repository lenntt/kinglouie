const expect = require('chai').expect;

const Label = require('../../../lib/model/Label');
const InstantiatedLabel = require('../../../lib/model/InstantiatedLabel');
const Trace = require('../../../lib/model/Trace');

const ModelBuilder = require('../../../lib/model/ModelBuilder');

describe('ModelBuilder', function() {
    var builder;
    beforeEach(function() {
        builder = new ModelBuilder();
    });

    describe('constructor', function() {
        it('has initially an empty list of traces if none given', function() {
            expect(builder.traces).to.be.empty;
        });
    });

    describe('#build', function() {
        describe('when there are no traces', function() {
            it('returns a model that only has a start state and no labels', function() {
                var model = builder.build();
                expect(model.states).to.have.a.lengthOf(1);
                expect(model.labels).to.be.empty;
            });
        });

        describe('when there are a few traces', function() {
            it('returns a model that can simulate the given traces', function() {
                var label1 = new Label('label1');
                var label2 = new Label('label2');
                var ilabel1 = new InstantiatedLabel(label1);
                var ilabel2 = new InstantiatedLabel(label2);

                var trace1 = new Trace();
                trace1.add(ilabel1);
                trace1.add(ilabel2);
                trace1.add(ilabel2);

                var trace2 = new Trace();
                trace2.add(ilabel2);
                trace2.add(ilabel1);

                // But should not re-add the same transition
                var trace3 = new Trace();
                trace3.add(ilabel1);

                builder = new ModelBuilder([trace1, trace2, trace3]);
                var model = builder.build();
                expect(model.initialState.outs).to.have.lengthOf(2);
                expect(model.labels).to.have.lengthOf(2);
            });
        });

        describe('when ilabels have the state in their metadata', function() {
            it('routes the transitions to that state', function() {
                var label1 = new Label('label1');
                var ilabel1 = new InstantiatedLabel(label1);
                ilabel1.updateMetadata({state: 'state1'});

                var trace1 = new Trace();
                trace1.add(ilabel1);
                trace1.add(ilabel1);
                trace1.add(ilabel1);

                var trace2 = new Trace();
                trace2.add(ilabel1);
                trace2.add(ilabel1);

                builder = new ModelBuilder([trace1, trace2]);
                var model = builder.build();
                expect(model.initialState.outs).to.have.lengthOf(1);
                expect(model.states).to.have.lengthOf(2);
                expect(model.states[1].name).to.equal('state1');
            });
        });

        describe('when ilabels have a label parameter', function() {
            it('should add the transition with a guard to the model', function() {
                var label1 = new Label('label1');
                label1.addParameter('param');
                var ilabel1 = new InstantiatedLabel(label1, {'param': 'myValue'});

                var trace1 = new Trace();
                trace1.add(ilabel1);

                builder = new ModelBuilder([trace1]);
                var model = builder.build();

                var transition = model.initialState.outs[0];
                expect(transition.guard).to.have.property('param', 'myValue');
            });
        });

        // TODO: need to add a scenario why _addTrace currentState is set to transition.to and not toState
    });
});

