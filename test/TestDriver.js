var WebDriver = require('selenium-webdriver').WebDriver;

class TestDriver extends WebDriver {
    constructor() {
        super();
        this.elements = [];
        this.logs = [];
        this.currentUrl = '';
    }

    async get() {}
    async quit() {}

    async executeScript() {
        return Promise.resolve();
    }

    async findElements() {
        return Promise.resolve(this.elements);
    }

    async getCurrentUrl() {
        return Promise.resolve(this.currentUrl);
    }

    manage() {
        var logs = this.logs;
        return {
            logs() {
                return {
                    get() {
                        return Promise.resolve(logs);
                    }
                };
            }
        };
    }
}

module.exports = TestDriver;
