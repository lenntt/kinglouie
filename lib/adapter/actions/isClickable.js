module.exports = async function(element) {
    const displayed = await element.isDisplayed();
    const enabled = await element.isEnabled();
    return displayed && enabled;
};
