const webdriver = require('selenium-webdriver');
const By = webdriver.By;

class StateStrategy {
    constructor(driver) {
        this._driver = driver;
    }

    async didLeavePage(urlPattern) {
        var url = await this._driver.getCurrentUrl();
        return !url.match(new RegExp(urlPattern));
    }

    async fromUrl() {
        var url = await this._driver.getCurrentUrl();
        return url.split('?')[0].split('#')[0];
    }

    async numberOfElements(cssSelector) {
        var elements = await this._driver.findElements(By.css(cssSelector));
        return elements.length;
    }
}

module.exports = StateStrategy;
