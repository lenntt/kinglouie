class TestElement {
    constructor(id) {
        this.id = id;
    }

    async click() {
        return Promise.resolve();
    }

    async getAttribute(attr) {
        return Promise.resolve(`${attr}${this.id}`);
    }

    async getText() {
        return this.getAttribute('text');
    }

    async isDisplayed() {
        return Promise.resolve(true);
    }

    async isEnabled() {
        return Promise.resolve(true);
    }
}

module.exports = TestElement;
