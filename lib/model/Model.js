const expect = require('chai').expect;

const State = require('./State');
const Label = require('./Label');
const Transition = require('./Transition');

class Model {
    get labels()      { return this._labels; }
    get states()      { return this._states; }

    constructor(state) {
        expect(state).to.be.an.instanceof(State);

        this.initialState = state;

        this._states = [this.initialState];
        this._labels = [];
    }

    getLabel(label) {
        return this._labels.find(function(currentLabel) {
            return currentLabel.id === label.id;
        });
    }

    addLabel(label) {
        expect(label).to.be.an.instanceof(Label);

        return this.getLabel(label) || (this._labels.push(label) && label);
    }

    getState(state) {
        if (typeof state === 'string') {
            return this.getState(new State(state));
        }
        return this._states.find(function(currentState) {
            return currentState.id === state.id;
        });
    }

    findState(stateIdPattern) {
        return this._states.find(function(currentState) {
            return currentState.id.match(stateIdPattern);
        });
    }

    addState(state) {
        expect(state).to.be.an.instanceof(State);

        return this.getState(state) || (this._states.push(state) && state);
    }

    addTransition(from, label, to, guard = {}) {
        var modelFrom = this.getState(from);
        expect(modelFrom, `from state '${from.name}' is not known to the model`).to.be.ok;

        label = this.addLabel(label);
        to = this.addState(to);

        var transition = modelFrom.getTransitionFor(label, guard);
        if (!transition) {
            transition = new Transition(modelFrom, label, to, guard);
            modelFrom.registerTransition(transition);
        }

        return transition;
    }

    // Depth-first search
    findPath(targetState, startState) {
        targetState = this.getState(targetState);
        expect(targetState, 'targetState must be in model').to.be.ok;

        startState = startState ? this.getState(startState) : this.initialState;
        expect(startState, 'startState must be in model').to.be.ok;

        var visited = [];
        var stack = [{state: startState, transitions: []}];

        function transitionToFringeFn(path) {
            return function(transition) {
                return {
                    state: transition.to,
                    transitions: path.concat([transition])
                };
            };
        }

        while (stack.length) {
            var node = stack.pop();
            var state = node.state;
            var path = node.transitions;

            if (state === targetState) {
                return path;
            }

            if (visited.includes(state)) {
                continue;
            }

            stack = stack.concat(state.outs.map(transitionToFringeFn(path)));

            visited.push(state);
        }
        return null;
    }

    toDot() {
        var dotTransitions = '';
        for (var i = 0; i < this.states.length; i++) {
            var state = this.states[i];
            var dotTransition = state.outs.map(function(transition) {
                return transition.toDot();
            }).join('\n');
            dotTransitions = [dotTransitions, dotTransition].join('\n');
        }

        return `digraph {
            "_initialState" [style="invisible"]
            "_initialState" -> "${this.initialState.name}"
            ${dotTransitions}
        }`;
    }
}

module.exports = Model;
