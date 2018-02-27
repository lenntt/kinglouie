class State {
    constructor(name) {
        this.name = name;
        this.id = name;
        this.outs = [];
    }

    registerTransition(transition) {
        // TODO: should check for uniqueness
        // TODO: potientially guard for quiesence? (state cannot be quiescent and have output at the same time)
        this.outs.push(transition);
    }

    getTransitionFor(label, guard = {}) {
        return this.outs.find(function(transition) {
            return label.id === transition.label.id &&
                JSON.stringify(guard) === JSON.stringify(transition.guard);
        });
    }
}

module.exports = State;
