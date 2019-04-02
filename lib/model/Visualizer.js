const fs = require('fs');
const path = require('path');

const Screenshot = require('../adapter/Screenshot');

const ORIGINAL_MAX_MEMORY = 16777216;
const MAX_MEMORY_MULTIPLIER = 32;

function storeAndAddStateImages(states, workdir) {
    var addImages = '';
    states.forEach(function(state) {
        if (state.image) {
            var filename = `${state.sanitizedId}.png`;
            var screenshot = Screenshot.fromBase64(state.image);
            screenshot.store(path.join(workdir, filename));
            addImages += `.addImage("./${filename}", "${screenshot.png.width}px", "${screenshot.png.height}px")\n`;
        }
    });
    return addImages;
}

function storeAndAddTransitionImages(transitions, workdir) {
    var addImages = '';
    transitions.forEach(function(transition) {
        if (transition.guard.image) {
            var filename = `${transition.id}.png`;
            var screenshot = Screenshot.fromBase64(transition.guard.image);
            screenshot.store(path.join(workdir, filename));
            addImages += `.addImage("./${filename}", "${screenshot.png.width}px", "${screenshot.png.height}px")\n`;
        }
    });
    // return some.functioncall();
    return addImages;
}

class Visualizer {
    static createHTML(model, location) {
        var workdir = location.substring(0, location.lastIndexOf('/'));
        var html =
                `<!DOCTYPE html>
                <meta charset="utf-8">
                <body>
                    <script src="http://d3js.org/d3.v4.min.js"></script>
                    <script src="https://unpkg.com/viz.js@1.8.0/viz.js" type="javascript/worker"></script>
                    <script src="https://unpkg.com/d3-graphviz@2.6.0/build/d3-graphviz.min.js"></script>
                    <div id="graph" style="text-align: center;"></div>
                    <script>
                        d3.select("#graph").graphviz()
                            ${storeAndAddStateImages(model.states, workdir)}
                            ${storeAndAddTransitionImages(model.transitions, workdir)}
                            .totalMemory(${ORIGINAL_MAX_MEMORY * MAX_MEMORY_MULTIPLIER})
                            .fade(false)
                            .renderDot(\`${model.toDot(workdir)}\`);
                </script></body></html>`;
        return fs.writeFileSync(location, html);
    }
}

module.exports = Visualizer;
