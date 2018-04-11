const DEFAULT_TIMEOUT = 10000;

const isClickable = require('./isClickable');

class Click {
    get selector() { return this._selector; }

    constructor(driver, selector, config = {timeout: DEFAULT_TIMEOUT}) {
        this._driver = driver;
        this._selector = selector;
        this._config = config;
    }

    async execute() {
        const driver = this._driver;
        const timeout = this._config.timeout;

        return await driver.wait(async function() {
            // TODO: need to find out how to fail a poll with a message (replace 'return false')
            try {
                const element = await this._driver.findElement(this._selector);
                if ((await isClickable(element))) {
                    await element.click();
                    return element;
                }
                return false;
            } catch (e) {
                // No elements at all? or something serious happened
                console.error(e);
                return false;
            }
        }.bind(this), timeout, `no clickable element for: ${this.selector}`);
    }
}

module.exports = Click;
