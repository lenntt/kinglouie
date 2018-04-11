const expect = require('chai').expect;

const Labels = require('./Labels');
const ElementData = require('./ElementData');

const InstantiatedLabel = require('../model/InstantiatedLabel');
const Label = require('../model/Label');

class ILabels {
    static preamble(description) {
        return new InstantiatedLabel(Labels.preamble, {description: description});
    }

    static click(elementData) {
        expect(elementData).to.be.an.instanceOf(ElementData);

        return new InstantiatedLabel(Labels.click, elementData.toLabelData());
    }

    static stimulusError(message) {
        return new InstantiatedLabel(Labels.errorStimulus, {message: message});
    }

    static errorA11Y(message) {
        return new InstantiatedLabel(Labels.errorA11Y, {message: message});
    }

    static errorConsole(message) {
        return new InstantiatedLabel(Labels.errorConsole, {message: message});
    }

    static quiescence() {
        return new InstantiatedLabel(Label.quiescence());
    }
}

module.exports = ILabels;
