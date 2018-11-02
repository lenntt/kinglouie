module.exports = async function(element) {
    if (!element || !element.isDisplayed) {
        return false;
    }
    const displayed = await element.isDisplayed();
    const enabled = await element.isEnabled();
    return displayed && enabled;
};
