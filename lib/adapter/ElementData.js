const webdriver = require('selenium-webdriver');
const By = webdriver.By;

class ElementData {
    get text()      { return this._text; }
    get id()        { return this._id; }
    get className() { return this._className; }
    get label()     { return this._label; }

    constructor(text, id, className, label) {
        this._text = text;
        this._id = id;
        this._className = className;
        this._label = label;
    }

    toLabelData() {
        return {
            'text': this.text,
            'id': this.id,
            'className': this.className,
            'label': this.label
        };
    }

    toSelector() {
        // Use XPATH, as css has no text selector
        // TODO: we might want to losen ids (e.g. ignore numbers)

        var selectors = [];
        if (this.className) {
            selectors.push(`contains(@class, '${this.className}')`);
        }
        if (this.id) {
            selectors.push(`@id='${this.id}')`);
        }
        if (this.text) {
            selectors.push(`text()='${this.text}'`);
        }
        if (this.label) {
            selectors.push(`@aria-label='${this.label}'`);
        }

        return By.xpath(`//*[${selectors.join(' and ')}]`);
    }

    static async fromWebElement(element) {
        return new ElementData(
            await element.getText(),
            await element.getAttribute('id'),
            await element.getAttribute('class'),
            await element.getAttribute('aria-label')
        );
    }

    static fromILabel(ilabel) {
        return new ElementData(
            ilabel.data.text,
            ilabel.data.id,
            ilabel.data.className,
            ilabel.data.label
        );
    }
}

module.exports = ElementData;
