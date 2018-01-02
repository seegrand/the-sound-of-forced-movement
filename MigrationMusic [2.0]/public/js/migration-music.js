var data;

var svgWidth = 1000;
var svgHeight = 500;
var svgMinimapHeight = 70;

var transformTransition;
var transformTransitionDuration;

var margin;
var marginMinimap;
var width;
var height;
var heightMinimap;

var x;
var y;

var xMinimap;
var yMinimap;

var xAxis;
var xAxisMinimap;
var yAxis;
var yAxisPaddingFactor = 0.10;

var svg;
var focus;
var minimap;

var brush;
var zoom;

var menValueLine;
var womenValueLine;
var childrenValueLine;
var elderlyValueLine;

var menValueLineMinimap;
var womenValueLineMinimap;
var childrenValueLineMinimap;
var elderlyValueLineMinimap;

function start(data) {
    this.data = data;
    this.transformTransition = d3.easeLinear;
    this.transformTransitionDuration = 300;

    // Set the dimensions and margins of the graph
    margin = {
        top: 20,
        right: 40,
        bottom: svgMinimapHeight + 40,
        left: 20
    };
    marginMinimap = {
        top: svgHeight - svgMinimapHeight,
        right: 40,
        bottom: 30,
        left: 20
    };
    width = svgWidth - margin.left - margin.right;
    height = svgHeight - margin.top - margin.bottom;
    heightMinimap = svgHeight - marginMinimap.top - marginMinimap.bottom;

    // Parse the date / time
    var parseTime = d3.timeParse("%Y-%m");

    // Set the ranges
    x = d3.scaleTime().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);

    xMinimap = d3.scaleTime().range([0, width]);
    yMinimap = d3.scaleLinear().range([heightMinimap, 0]);

    xAxis = d3.axisBottom(x);
    xAxisMinimap = d3.axisBottom(xMinimap);
    yAxis = d3.axisRight(y);

    brush = d3.brushX()
        .extent([
            [0, 0],
            [width, heightMinimap]
        ])
        .on("brush end", brushed);

    zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([
            [0, 0],
            [width, height]
        ])
        .extent([
            [0, 0],
            [width, height]
        ])
        .on("zoom", zoomed);

    // Define value lines
    menValueLine = new MenValueLine(x, y);
    womenValueLine = new WomenValueLine(x, y);
    childrenValueLine = new ChildrenValueLine(x, y);
    elderlyValueLine = new ElderlyValueLine(x, y);

    menValueLineMinimap = new MenValueLine(xMinimap, yMinimap);
    womenValueLineMinimap = new WomenValueLine(xMinimap, yMinimap);
    childrenValueLineMinimap = new ChildrenValueLine(xMinimap, yMinimap);
    elderlyValueLineMinimap = new ElderlyValueLine(xMinimap, yMinimap);

    // Append the svg obgect to the body of the page
    // Appends a 'group' element to 'svg'
    // Moves the 'group' element to the top left margin
    svg = d3.select("body").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("id", "clip-rect")
        .attr("width", width - 200)
        .attr("height", height);

    focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    minimap = svg.append("g")
        .attr("class", "minimap")
        .attr("transform", "translate(" + marginMinimap.left + "," + marginMinimap.top + ")");

    // Format the data
    data.forEach(function (d) {
        d.period = parseTime(d.period);
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.period;
    }));
    y.domain([0, d3.max(data, function (d) {
        return Math.max(d.men, d.women, d.children, d.elderly) + yAxisPadding(Math.max(d.men, d.women, d.children, d.elderly));
    })]);

    xMinimap.domain(x.domain());
    yMinimap.domain(y.domain());

    // Add the X Axis
    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    focus.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + width + ", 0)")
        .call(yAxis);

    focus.append("g")
        .attr("class", "chart-body")
        .attr("clip-path", "url(#clip)");

    // Add the menValueLine path.
    focus.select("g.chart-body")
        .append("path")
        .datum(data)
        .attr("id", "men")
        .attr("class", "line")
        .attr("d", menValueLine);

    // Add the womenValueLine path.
    focus.select("g.chart-body")
        .append("path")
        .datum(data)
        .attr("id", "women")
        .attr("class", "line")
        .attr("d", womenValueLine);

    // Add the childrenValueLine path.
    focus.select("g.chart-body")
        .append("path")
        .datum(data)
        .attr("id", "children")
        .attr("class", "line")
        .attr("d", childrenValueLine);

    // Add the elderlyValueLine path.
    focus.select("g.chart-body")
        .append("path")
        .datum(data)
        .attr("id", "elderly")
        .attr("class", "line")
        .attr("d", elderlyValueLine);

    minimap.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + heightMinimap + ")")
        .call(xAxisMinimap);

    minimap.append("path")
        .datum(data)
        .attr("id", "men")
        .attr("class", "line")
        .attr("d", menValueLineMinimap);

    minimap.append("path")
        .datum(data)
        .attr("id", "women")
        .attr("class", "line")
        .attr("d", womenValueLineMinimap);

    minimap.append("path")
        .datum(data)
        .attr("id", "children")
        .attr("class", "line")
        .attr("d", childrenValueLineMinimap);

    minimap.append("path")
        .datum(data)
        .attr("id", "elderly")
        .attr("class", "line")
        .attr("d", elderlyValueLineMinimap);

    minimap.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);
}

function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom

    var transitionEaseLinear = d3.transition()
        .duration(transformTransitionDuration)
        .ease(transformTransition);

    var s = d3.event.selection || xMinimap.range();
    x.domain(s.map(xMinimap.invert, xMinimap));

    focus.select("#men").transition(transitionEaseLinear).attr("d", menValueLine);
    focus.select("#women").transition(transitionEaseLinear).attr("d", womenValueLine);
    focus.select("#children").transition(transitionEaseLinear).attr("d", childrenValueLine);
    focus.select("#elderly").transition(transitionEaseLinear).attr("d", elderlyValueLine);

    // Rescale x axis
    focus.select(".axis--x").transition(transitionEaseLinear).call(xAxis);

    // Rescale y axis
    y.domain([0, d3.max(data, function (d) {
        if (d.period >= x.domain()[0] && d.period <= x.domain()[1]) {
            return Math.max(d.men, d.women, d.children, d.elderly) + yAxisPadding(Math.max(d.men, d.women, d.children, d.elderly));
        }
    })]);

    focus.select(".axis--y")
        .transition(transitionEaseLinear)
        .call(yAxis);

    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));
}

function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush

    var t = d3.event.transform;

    var transitionEaseLinear = d3.transition()
        .duration(transformTransitionDuration)
        .ease(transformTransition);

    x.domain(t.rescaleX(xMinimap).domain());

    focus.select("#men").transition(transitionEaseLinear).attr("d", menValueLine);
    focus.select("#women").transition(transitionEaseLinear).attr("d", womenValueLine);
    focus.select("#children").transition(transitionEaseLinear).attr("d", childrenValueLine);
    focus.select("#elderly").transition(transitionEaseLinear).attr("d", elderlyValueLine);

    // Rescale x axis
    focus.select(".axis--x").transition(transitionEaseLinear).call(xAxis);

    // Rescale y axis
    y.domain([0, d3.max(data, function (d) {
        if (d.period >= x.domain()[0] && d.period <= x.domain()[1]) {
            return Math.max(d.men, d.women, d.children, d.elderly) + yAxisPadding(Math.max(d.men, d.women, d.children, d.elderly));
        }
    })]);

    focus.select(".axis--y")
        .transition(transitionEaseLinear)
        .call(yAxis);

    minimap.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

function yAxisPadding(maxValue) {
    return maxValue * yAxisPaddingFactor;
}