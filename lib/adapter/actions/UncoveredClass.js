class Uncovered {
    constructor(parameter) {
        this.value = parameter ? '5' : false;
    }

    myFunction() {
        var x = 0;
        if (x === 'omg') {
            return 'you cant be serious';
        }
        return this;
    }
}

module.exports = Uncovered;
