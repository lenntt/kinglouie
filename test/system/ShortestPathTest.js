const expect = require('chai').expect;

const KingLouie = require('../../lib/KingLouie');

const Driver = require('../TestDriver');
const App = require('../TestApp');

describe('Google - KingLouie - shortest path finder', function() {
    var kinglouie;
    beforeEach(function() {
        kinglouie = new KingLouie(new Driver(), new App());
        kinglouie.loadTraces('./test/system/testtraces/');
    });

    it('finds the shortest path to https://www.google.com/analytics/', function() {
        var path = kinglouie.findPath('https://www.google.com/analytics/');
        expect(path).not.to.be.empty;
        var labels = path.map(function(transition) {
            return [transition.label.name, transition.guard];
        });
        expect(labels).to.eql([
            ['?preamble', {'description': 'go to http://www.google.com/#hl=en'}],
            ['δ', {}],
            ['?click', {'text': 'Google.com gebruiken', 'class': '_Gs'}],
            ['δ', {}],
            ['?click', {'text': 'Business', 'class': '_Gs'}],
            ['δ', {}],
            ['?click', {'text': 'Google Analytics'}],
            ['δ', {}]
        ]);
    });
});
