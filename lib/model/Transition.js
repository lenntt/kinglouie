const expect = require('chai').expect;

const State = require('./State');
const Label = require('./Label');

function sanitizeForDot(str) {
    return str.replace('"', '\\"').replace('\'', '\\\'').replace('\n', ', ');
}

class Transition {
    get from()     { return this._from; }
    get label()    { return this._label; }
    get to()       { return this._to; }
    get guard()    { return this._guard; }
    // sanitizing, e.g. to use as file name
    get id()       { return (this.from.id + this.label.id + this.to.id).replace(/[^a-z0-9]/g, '_'); }

    constructor(from, label, to, guard = {}) {
        expect(from).to.be.an.instanceof(State);
        expect(label).to.be.an.instanceof(Label);
        expect(to).to.be.an.instanceof(State);

        this._from = from;
        this._label = label;
        this._to = to;
        this._guard = guard;
    }

    addCondition(parameter, value) {
        expect(parameter).to.be.a('string');
        expect(value).to.be.a('string');
        this._guard[parameter] = value;
    }

    toDot() {
        const from = sanitizeForDot(this.from.name);
        const to = sanitizeForDot(this.to.name);
        const label = sanitizeForDot(this.label.name);
        const guard = Object.keys(this.guard)
            // TODO: this shouldn't go here, make optional parameters/metadata?
            .filter(function(key) {
                return key !== 'image';
            })
            .map(function(key) {
                // TODO: might as well be a table (like in image)
                return sanitizeForDot(`${key} == ${this.guard[key]}`);
            }.bind(this)).join('\\n');

        var labelStr = guard ? `${label}\\n${guard}` : label;
        if (this.guard.image) {
            labelStr = `<<table border="0"><tr><td><img src="./${this.id}.png"/></td></tr><tr><td>${labelStr}</td></tr></table>>`;
        } else {
            labelStr = `"${labelStr}"`;
        }

        const color = RegExp('.?error').test(label) ? 'red' : 'black';
        return `"${from}" -> "${to}" [label=${labelStr} color="${color}"]`;
    }
}

module.exports = Transition;
