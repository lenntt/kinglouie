const expect = require('chai').expect;

class Label {
    get name()       { return this._name; }
    get id()         { return this._id; }
    get response()   { return this._response; }
    get quiescence() { return this._quiescence; }
    get parameters() { return this._parameters; }

    constructor(name, isResponse = false, isQuiescence = false) {
        this._name = name;
        this._id = name;
        this._response = isResponse;
        this._quiescence = isQuiescence;
        this._parameters = [];
    }

    addParameter(name) {
        expect(name).to.be.a('string');
        expect(this.parameters).not.to.include(name);

        this.parameters.push(name);
    }

    static quiescence() {
        return new Label('δ', false, true);
    }

    static response(name) {
        return new Label('!' + name, true);
    }

    static stimulus(name) {
        return new Label('?' + name, false);
    }

    static fromJSON(json) {
        // TODO: ID is not read from JSON
        var label = new Label(json._name, json._response, json._quiescence);
        for (var i = 0; i < json._parameters.length; i++) {
            var parameter = json._parameters[i];
            label.addParameter(parameter);
        }
        return label;
    }
}

module.exports = Label;
