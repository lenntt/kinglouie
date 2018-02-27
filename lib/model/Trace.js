const expect = require('chai').expect;
const fs = require('fs');

const InstantiatedLabel = require('./InstantiatedLabel');

class Trace extends Array {
    static fromArray(ilabels) {
        var trace = new Trace();
        for (var i = 0; i < ilabels.length; i++) {
            var ilabel = ilabels[i];
            trace.push(ilabel);
        }
        return trace;
    }

    static fromJSON(json) {
        var trace = new Trace();
        for (var i = 0; i < json.length; i++) {
            var ilabel = json[i];
            trace.add(InstantiatedLabel.fromJSON(ilabel));
        }
        return trace;
    }

    static fromFile(location) {
        var json = JSON.parse(fs.readFileSync(location).toString());
        return Trace.fromJSON(json);
    }

    toFile(location) {
        fs.writeFileSync(location, JSON.stringify(this));
    }

    add(ilabel) {
        expect(ilabel).to.be.an.instanceof(InstantiatedLabel);
        this.push(ilabel);
    }

    addAll(trace) {
        expect(trace).to.be.an.instanceof(Trace);
        for (var i = 0; i < trace.length; i++) {
            var ilabel = trace[i];
            this.add(ilabel);
        }
        return trace;
    }
}

module.exports = Trace;
