const Model = require('./Model');
const State = require('./State');

/**
 * Builds up models from traces
 */
class ModelBuilder {
    constructor(traces, labels) {
        this.traces = traces || [];
        this._labels = labels || {};
        this._count = 0;
    }

    // TODO: move _addTrace to model.extend?
    _addTrace(model, trace) {
        var getToState = function() {
            return new State(`_${this._count++}`);
        }.bind(this);

        var currentState = model.initialState;
        for (var i = 0; i < trace.length; i++) {
            var ilabel = trace[i];

            var toState;
            if (ilabel.metadata.state) {
                toState = model.addState(new State(ilabel.metadata.state));
            } else {
                toState = getToState();
            }
            // TODO: add image property formally to State!!
            if (ilabel.metadata.stateImage) {
                toState.image = ilabel.metadata.stateImage;
            }

            // TODO: implement 'optional parameters', not all data needs to guard?
            var transition = model.addTransition(currentState, ilabel.label, toState, ilabel.data);
            currentState = transition.to;
        }
        return model;
    }

    build() {
        var initialState = new State('start');
        var model = new Model(initialState);

        for (var i = 0; i < this.traces.length; i++) {
            var trace = this.traces[i];
            model = this._addTrace(model, trace);
        }

        return model;
    }
}

module.exports = ModelBuilder;
