(function (settings) {
    Array.prototype.slice.call(document.querySelectorAll(settings.selector))
        .forEach(function (element) {
            settings.addGraph(element, settings);
        });
})({
    "selector": "#background",
    "numPoints": 7,
    "pointSize": function () {
        return Math.floor(Math.random() * 21) + 7;
    },
    "addGraph": function (element, settings) {
        console.log("Adding", element);
        var points = [],
            i;

        for (i = 0; i < settings.numPoints; i += 1) {
            settings.addPoint(element, settings);
        }
    },
    "addPoint": function (element, settings) {
        d3.select(element)
            .append("svg")
            .attr("width", element.clientWidth)
            .attr("height", element.clientHeight)
            .append("circle")
            .attr("cx", Math.floor(Math.random() * element.clientWidth))
            .attr("cy", Math.floor(Math.random() * element.clientHeight))
            .attr("r", settings.pointSize())
            .style("fill", "rgba(210, 210, 210, .7");
    }
});

window.durp = true;