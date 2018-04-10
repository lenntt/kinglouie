const expect = require('chai').expect;

const Label = require('../model/Label');

function preamble() {
    const label = Label.stimulus('preamble');
    label.addParameter('description');

    return label;
}

function click() {
    const label = Label.stimulus('click');
    label.addParameter('text');
    label.addParameter('label');
    label.addParameter('className');
    label.addParameter('id');

    return label;
}

function error(type = 'error', labelType = 'response') {
    expect(type.startsWith('error')).to.be.true;

    const label = Label[labelType](`${type}`);
    label.addParameter('message');

    return label;
}

module.exports = {
    'preamble': preamble(),
    'click': click(),
    'errorStimulus': error('error_stimulus', 'stimulus'),

    'errorA11Y': error('error_a11y'),
    'errorConsole': error('error_console')
};
