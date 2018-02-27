const fs = require('fs');

const ORIGINAL_MAX_MEMORY = 16777216;
const MAX_MEMORY_MULTIPLIER = 32;

class Visualizer {
    static createHTML(model, location) {
        var html =
                `<!DOCTYPE html>
                <meta charset="utf-8">
                <body>
                    <script src="http://d3js.org/d3.v4.min.js"></script>
                    <script src="https://unpkg.com/viz.js@1.8.0/viz.js" type="javascript/worker"></script>
                    <script src="https://unpkg.com/d3-graphviz@1.0.1/build/d3-graphviz.min.js"></script>
                    <div id="graph" style="text-align: center;"></div>
                    <script>
                        d3.select("#graph").graphviz()
                            .totalMemory(${ORIGINAL_MAX_MEMORY * MAX_MEMORY_MULTIPLIER})
                            .fade(false)
                            .renderDot(\`${model.toDot()}\`);
                </script></body></html>`;
        return fs.writeFileSync(location, html);
    }
}

module.exports = Visualizer;
