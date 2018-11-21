const webdriver = require('selenium-webdriver');
const By = webdriver.By;

const Screenshot = require('./Screenshot');

class ElementData {
    get text()      { return this._text; }
    get id()        { return this._id; }
    get className() { return this._className; }
    get label()     { return this._label; }
    get image()     { return this._image; }

    // eslint-disable-next-line max-params
    constructor(text, id, className, label, image) {
        this._text = text;
        this._id = id;
        this._className = className;
        this._label = label;
        this._image = image;
    }

    toLabelData() {
        return {
            'text': this.text,
            'id': this.id,
            'className': this.className,
            'label': this.label,
            'image': this.image
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
            selectors.push(`@id='${this.id}'`);
        }
        if (this.text) {
            selectors.push(`text()='${this.text}'`);
        }
        if (this.label) {
            selectors.push(`@aria-label='${this.label}'`);
        }

        return By.xpath(`//*[${selectors.join(' and ')}]`);
    }

    toWeakSelector() {
        var selectors = [];
        if (this.text) {
            selectors.push(`text()='${this.text}'`);
        }
        if (this.label) {
            selectors.push(`@aria-label='${this.label}'`);
        }

        return By.xpath(`//*[${selectors.join(' and ')}]`);
    }

    static async fromWebElement(element, takeScreenshot) {
        var screenshot = null;
        if (takeScreenshot) {
            var driver = element.getDriver();
            screenshot = (await Screenshot.fromWebElement(driver, element)).toBase64();
        }

        return new ElementData(
            await element.getText(),
            await element.getAttribute('id'),
            await element.getAttribute('class'),
            await element.getAttribute('aria-label'),
            screenshot
        );
    }

    static fromILabel(ilabel) {
        return new ElementData(
            ilabel.data.text,
            ilabel.data.id,
            ilabel.data.className,
            ilabel.data.label,
            ilabel.data.image
        );
    }
}

module.exports = ElementData;
