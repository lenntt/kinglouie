const expect = require('chai').expect;

const Trace = require('../../lib/model/Trace');
const Label = require('../../lib/model/Label');
const InstantiatedLabel = require('../../lib/model/InstantiatedLabel');

describe('Trace', function() {
    var ilabel, label, trace;
    beforeEach(function() {
        label = new Label('action');
        ilabel = new InstantiatedLabel(label);
        trace = new Trace();
    });

    describe('constructor', function() {
        it('has no ilabels intially', function() {
            expect(trace).to.be.empty;
        });
    });

    describe('.fromArray', function() {
        it('returns a trace with the given ilabels', function() {
            trace = Trace.fromArray([ilabel, ilabel]);
            expect(trace).to.be.an.instanceof(Trace);
            expect(trace).to.eql([ilabel, ilabel]);
        });
    });

    describe('.fromFile', function() {
        describe('when the ilabels in the file have no label parameters', function() {
            it('returns the trace instantiated from the file', function() {
                trace = Trace.fromFile('./test/model/testdata/trace1.json');
                expect(trace).to.have.lengthOf(3);

                var preamble = trace[0];
                expect(preamble).to.be.an.instanceOf(InstantiatedLabel);
                expect(preamble.label).to.have.property('name', '?pre');

                var error1 = trace[1];
                expect(error1.label).to.have.property('name', '!error_a11y');

                var stimulus1 = trace[2];
                expect(stimulus1.label).to.have.property('name', '?click');
            });
        });
    });

    describe('.fromJSON', function() {
        it('returns the trace with the ilabels from the JSON', function() {
            trace = Trace.fromArray([ilabel, ilabel]);
            const json = JSON.parse(JSON.stringify(trace));

            trace = Trace.fromJSON(json);
            expect(trace).to.be.an.instanceOf(Trace);
            expect(trace).to.have.lengthOf(2);
            expect(trace[0]).to.be.an.instanceOf(InstantiatedLabel);
            expect(trace[1]).to.be.an.instanceOf(InstantiatedLabel);
        });

        it('returns the trace with the ilabels from the JSON when the ilabel has parameters', function() {
            label.addParameter('param');
            ilabel = new InstantiatedLabel(label, {'param': 'myValue'});

            trace = Trace.fromArray([ilabel]);
            const json = JSON.parse(JSON.stringify(trace));

            trace = Trace.fromJSON(json);
            expect(trace).to.be.an.instanceOf(Trace);
            expect(trace).to.have.lengthOf(1);
            expect(trace[0]).to.be.an.instanceOf(InstantiatedLabel);
            expect(trace[0].label.parameters).to.have.lengthOf(1);
            expect(trace[0].label.parameters[0]).to.have.equal('param');
        });

        it('returns an empty trace if JSON has no ilabels', function() {
            trace = Trace.fromJSON([]);
            expect(trace).to.be.an.instanceOf(Trace);
            expect(trace).to.have.lengthOf(0);
        });
    });

    describe('#toFile', function() {
        it('saves a file to disk', function() {
            this.skip('TODO');
        });
    });

    describe('#add', function() {
        it('adds the given instantiated label to the trace', function() {
            trace.add(ilabel);
            expect(trace).to.have.lengthOf(1);
        });
    });

    describe('#addAll', function() {
        it('adds every given instantiated label in the given trace to the current one', function() {
            trace.add(ilabel);

            var trace2 = new Trace();
            trace2.add(ilabel);
            trace2.add(ilabel);

            expect(trace).to.have.lengthOf(1);
            trace.addAll(trace2);
            expect(trace).to.have.lengthOf(3);
        });
    });
});
