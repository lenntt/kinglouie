const expect = require('chai').expect;

const State = require('./State');
const Label = require('./Label');

function sanitizeForDot(str) {
    return str.replace('"', '\\"').replace('\'', '\\\'').replace('\n', ', ');
}

class Transition {
    get from()   { return this._from; }
    get label()  { return this._label; }
    get to()     { return this._to; }
    get guard()  { return this._guard; }

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
        const from = sanitizeForDot(this._from.name);
        const to = sanitizeForDot(this._to.name);
        const label = sanitizeForDot(this._label.name);
        const guard = Object.keys(this._guard).map(function(key) {
            return sanitizeForDot(`${key} == ${this._guard[key]}`);
        }.bind(this)).join('\\n');

        var labelStr = guard ? `${label}\\n${guard}` : label;

        const color = RegExp('.?error').test(label) ? 'red' : 'black';
        return `"${from}" -> "${to}" [label="${labelStr}" color="${color}"]`;
    }
}

module.exports = Transition;
