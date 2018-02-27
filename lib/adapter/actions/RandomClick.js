const webdriver = require('selenium-webdriver');
const By = webdriver.By;

const DEFAULT_TIMEOUT = 10000;
const FINDER_RATIO = 10;

class RandomClick {
    constructor(driver, config = {timeout: DEFAULT_TIMEOUT}) {
        this._driver = driver;
        this._config = config;
        this.COLOR_LIST = ['blue', 'purple', 'red'];
        this.currentColorIndex = 0;
    }

    async execute() {
        const driver = this._driver;
        const self = this;
        const timeout = this._config.timeout;

        async function findAllClickables(_driver, _timeout) {
            const clickableSelector = 'a,button,.button,[role="button"],[role="link"],[role="menuitem"]';

            return await _driver.wait(async function() {
                const clickables = await _driver.findElements(By.css(clickableSelector));
                if (clickables.length > 0) {
                    return clickables;
                }
                return null;
            }, _timeout);
        }

        function getColor() {
            return self.COLOR_LIST[self.currentColorIndex % self.COLOR_LIST.length];
        }

        function updateColor() {
            self.currentColorIndex++;
        }

        async function decorate(_driver, element) {
            await _driver.executeScript(function(_element, color) {
                _element.style.border = `5px solid ${color}`;
            }, element, getColor());
        }

        function shuffle(array) {
            const newArray = array.slice();
            for (var i = newArray.length - 1; i > 0; i--) {
                var rand = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[rand]] = [newArray[rand], newArray[i]];
            }
            return newArray;
        }

        return await driver.wait(async function() {
            // TODO: need to find out how to fail a poll with a message (replace 'return false')
            try {
                const allClickables = shuffle(await findAllClickables(driver, timeout / FINDER_RATIO));
                while (allClickables.length > 0) {
                    var clickable = allClickables.pop();

                    try {
                        const displayed = await clickable.isDisplayed();
                        const enabled = await clickable.isEnabled();
                        if (!displayed || !enabled) {
                            // Not clickable, try next
                            continue;
                        }

                        var elementData = {
                            text: await clickable.getText(),
                            id: await clickable.getAttribute('id'),
                            class: await clickable.getAttribute('class'),
                            label: await clickable.getAttribute('aria-label')
                        };

                        await decorate(driver, clickable);
                        await clickable.click();
                        return elementData;
                    } catch (e) {
                        // click fails, so try another one
                    }
                }
                updateColor();
                // No elements left
                return false;
            } catch (e) {
                // No elements at all? or something serious happened
                console.error(e);
                return false;
            }
        }, timeout, 'no clickable elements found');
    }
}

module.exports = RandomClick;
