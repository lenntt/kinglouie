var AxeBuilder = require('axe-webdriverjs');

const ILabels = require('../ILabels');

const Trace = require('../../model/Trace');

class A11YCheck {
    constructor(driver) {
        this._driver = driver;
    }

    async check() {
        // Can customize checks: see https://github.com/dequelabs/axe-webdriverjs
        var driver = this._driver;

        try {
            var results = await new AxeBuilder(driver).analyze();
            var ilabels = [];
            if (results.violations) {
                ilabels = results.violations.map(function(violation) {
                    return ILabels.errorA11Y(`'${violation.id}' on ${violation.nodes.length} node(s)`);
                });
            }
            return Trace.fromArray(ilabels);
        } catch (e) {
            return new Trace();
        }
    }
}

module.exports = A11YCheck;
