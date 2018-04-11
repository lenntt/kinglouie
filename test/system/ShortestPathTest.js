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

    describe('finding a path with an error in it', function() {
        it('finds the shortest path to https://support.google.com/plus/', function() {
            var path = kinglouie.findPath('https://support.google.com/plus/');
            expect(path).not.to.be.empty;
            var labels = path.map(function(transition) {
                return [transition.label.name, transition.guard];
            });
            expect(labels).to.eql([
                ['?preamble', {'description': 'go to http://www.google.com/#hl=en'}],
                ['δ', {}],
                ['?click', {'text': 'Gmail', 'class': 'gb_P'}],
                ['!error_console', {'message': 'https://apis.google.com/_/scs/apps-static/_/js/k=oz.gapi.en.6_Oh42KNmBQ.O/m=plusone/rt=j/sv=1/d=1/ed=1/am=AQE/rs=AGLTcCOLDThr61T0lUfV81vOOCnO7rxu2w/cb=gapi.loaded_0 163 Failed to execute \'postMessage\' on \'DOMWindow\': The target origin provided (\'https://accounts.google.com\') does not match the recipient window\'s origin (\'https://www.google.com\').'}],
                ['?click', {'text': 'Privacy'}],
                ['δ', {}],
                ['?click', {'text': 'Control'}],
                ['!error_console', {'message': 'https://realtimesupport.clients6.google.com/v2/customers/me/availabilities?alt=json&source=HELP_CENTER&client_version=1519808644576&key=AIzaSyB5V4SIBGmrqREm7kf2fBJgPcBMCdUrLzE - Failed to load resource: the server responded with a status of 401 ()'}]
            ]);
        });
    });
});
