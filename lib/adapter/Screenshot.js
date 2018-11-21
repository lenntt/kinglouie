const PNG = require('pngjs').PNG;
const fs = require('fs');

class Screenshot {
    constructor(png) {
        this.png = png;
    }

    store(location) {
        fs.writeFileSync(location, PNG.sync.write(this.png));
    }

    toBase64() {
        return PNG.sync.write(this.png).toString('base64');
    }

    static fromBase64(base64str) {
        return new Screenshot(PNG.sync.read(Buffer.from(base64str, 'base64')));
    }

    static async fromWebElement(driver, element) {
        // rect: {height: number, width: number, x: number, y: number};
        var rect = await element.getRect();

        var cropped = new PNG({width: rect.width, height: rect.height});
        var yOffset = await driver.executeScript(function() {
            // eslint-disable-next-line no-undef
            return window.pageYOffset;
        });

        var pageImg = await Screenshot.fromPage(driver);

        PNG.bitblt(pageImg.png, cropped, rect.x, rect.y - yOffset, rect.width, rect.height, 0, 0);
        return new Screenshot(cropped);
    }

    static async fromPage(driver) {
        return Screenshot.fromBase64(await driver.takeScreenshot());
    }
}

module.exports = Screenshot;
