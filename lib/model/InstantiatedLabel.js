const expect = require('chai').expect;

const Label = require('./Label');

function prepareData(label, data) {
    var preparedData = {};

    for (var paramName in data) {
        if (label.parameters.includes(paramName)) {
            var value = data[paramName];
            if (value !== null && value !== '') {
                preparedData[paramName] = value;
            }
        } else {
            throw new Error(`unknown label parameter '${paramName}'`);
        }
    }

    return preparedData;
}

class InstantiatedLabel {
    get label()     { return this._label; }
    get data()      { return this._data; }
    get metadata()  { return this._metadata; }

    constructor(label, data, metadata = {}) {
        expect(label).to.be.an.instanceof(Label);
        this._label = label;
        this._data = prepareData(label, data);
        this.updateMetadata(metadata);
    }

    static fromJSON(json) {
        return new InstantiatedLabel(
            Label.fromJSON(json._label),
            json._data,
            json._metadata
        );
    }

    toJSON() {
        return this;
    }

    updateMetadata(metadata) {
        this._metadata = Object.assign(metadata, {timestamp: Date.now()});
    }
}

module.exports = InstantiatedLabel;
