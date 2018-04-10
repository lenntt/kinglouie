const webdriver = require('selenium-webdriver');
const By = webdriver.By;

const ElementData = require('../ElementData');

const DEFAULT_TIMEOUT = 10000;
const FINDER_RATIO = 10;

function shuffle(array) {
    const newArray = array.slice();
    for (var i = newArray.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[rand]] = [newArray[rand], newArray[i]];
    }
    return newArray;
}

async function isClickable(element) {
    const displayed = await element.isDisplayed();
    const enabled = await element.isEnabled();
    return displayed && enabled;
}

class RandomClick {
    get color() { return this.COLOR_LIST[this.currentColorIndex % this.COLOR_LIST.length]; }

    constructor(driver, config = {timeout: DEFAULT_TIMEOUT}) {
        this._driver = driver;
        this._config = config;
        this.COLOR_LIST = ['blue', 'purple', 'red'];
        this.currentColorIndex = 0;
    }

    async decorate(element) {
        await this._driver.executeScript(function(_element, color) {
            _element.style.border = `5px solid ${color}`;
        }, element, this.color);
    }

    async findAllClickables(timeout) {
        const clickableSelector = 'a,button,.button,[role="button"],[role="link"],[role="menuitem"]';

        return await this._driver.wait(async function() {
            const clickables = await this._driver.findElements(By.css(clickableSelector));
            if (clickables.length > 0) {
                return clickables;
            }
            return null;
        }.bind(this), timeout);
    }

    async execute() {
        const driver = this._driver;
        const timeout = this._config.timeout;

        return await driver.wait(async function() {
            // TODO: need to find out how to fail a poll with a message (replace 'return false')
            try {
                const allClickables = shuffle(await this.findAllClickables(timeout / FINDER_RATIO));
                while (allClickables.length > 0) {
                    var clickable = allClickables.pop();

                    try {
                        if (!(await isClickable(clickable))) {
                            // Not clickable, try next
                            continue;
                        }

                        var elementData = await ElementData.fromWebElement(clickable);
                        await this.decorate(clickable);
                        await clickable.click();
                        return elementData;
                    } catch (e) {
                        // click fails, so try another one
                    }
                }
                // No clickable elements left
                this.currentColorIndex++;
                return false;
            } catch (e) {
                // No elements at all? or something serious happened
                console.error(e);
                return false;
            }
        }.bind(this), timeout, 'no clickable elements found');
    }
}

module.exports = RandomClick;
