var data;

var svgWidth = 1000;
var svgHeight = 800;
var svgMinimapHeight = 120;

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
var yAxisPaddingFactor = 0.60;

var svg;
var focus;
var minimap;

var brush;
var brushX = 0;

var zoom;

var graphAreaMargin = 200;

var pathMen;
var pathWomen;
var pathChildren;
var pathElderly;

var circleMenRefugees;
var circleMenDepandants;
var circleWomenRefugees;
var circleWomenDepandants;
var circleChildrenRefugees;
var circleChildrenDepandants;
var circleElderlyRefugees;
var circleElderlyDepandants;

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
    this.transformTransitionDuration = 1000;

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

    xAxis = d3.axisBottom(x).ticks(8);
    xAxisMinimap = d3.axisBottom(xMinimap).ticks(5);
    yAxis = d3.axisRight(y).ticks(5);

    brush = d3.brushX()
        .extent([
            [0, 0],
            [width, heightMinimap]
        ])
        .on("brush end", brushed, {
            once: true,
            passive: true
        });

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
    svg = d3.select("#graph").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    svg.append("defs")
        .append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("id", "clip-rect")
        .attr("width", width - graphAreaMargin)
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
        .attr("class", "axis axis--white axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    focus.append("g")
        .attr("class", "axis axis--white axis--y")
        .attr("transform", "translate(" + width + ", 0)")
        .call(yAxis);

    focus.append("g")
        .attr("class", "chart-body")
        .attr("clip-path", "url(#clip)");

    // Add the menValueLine path.
    pathMen = focus.select("g.chart-body")
        .append("path")
        .datum(data)
        .attr("id", "men")
        .attr("class", "line")
        .attr("d", menValueLine);

    // Add the womenValueLine path.
    pathWomen = focus.select("g.chart-body")
        .append("path")
        .datum(data)
        .attr("id", "women")
        .attr("class", "line")
        .attr("d", womenValueLine);

    // Add the childrenValueLine path.
    pathChildren = focus.select("g.chart-body")
        .append("path")
        .datum(data)
        .attr("id", "children")
        .attr("class", "line")
        .attr("d", childrenValueLine);

    // Add the elderlyValueLine path.
    pathElderly = focus.select("g.chart-body")
        .append("path")
        .datum(data)
        .attr("id", "elderly")
        .attr("class", "line")
        .attr("d", elderlyValueLine);

    // Add the men circle.
    circleMenDepandants = focus.select("g.chart-body")
        .append("circle")
        .attr("id", "men")
        .attr("class", "circle")
        .attr("class", "depandants")
        .attr("r", "16");

    circleMenRefugees = focus.select("g.chart-body")
        .append("circle")
        .attr("id", "men")
        .attr("class", "circle")
        .attr("class", "refugees")
        .attr("r", "10");

    // Add the women circle.
    circleWomenDepandants = focus.select("g.chart-body")
        .append("circle")
        .attr("id", "women")
        .attr("class", "circle")
        .attr("class", "depandants")
        .attr("r", "16");

    circleWomenRefugees = focus.select("g.chart-body")
        .append("circle")
        .attr("id", "women")
        .attr("class", "circle")
        .attr("class", "refugees")
        .attr("r", "10");

    // Add the children circle.
    circleChildrenDepandants = focus.select("g.chart-body")
        .append("circle")
        .attr("id", "children")
        .attr("class", "circle")
        .attr("class", "depandants")
        .attr("r", "16");

    circleChildrenRefugees = focus.select("g.chart-body")
        .append("circle")
        .attr("id", "children")
        .attr("class", "circle")
        .attr("class", "refugees")
        .attr("r", "10");

    // Add the elderly circle.
    circleElderlyDepandants = focus.select("g.chart-body")
        .append("circle")
        .attr("id", "elderly")
        .attr("class", "circle")
        .attr("class", "depandants")
        .attr("r", "16");

    circleElderlyRefugees = focus.select("g.chart-body")
        .append("circle")
        .attr("id", "elderly")
        .attr("class", "circle")
        .attr("class", "refugees")
        .attr("r", "10");

    minimap.append("g")
        .attr("class", "axis axis--white axis--x")
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
        .call(brush.move, [0, 32]);

    // svg.append("rect")
    //     .attr("class", "zoom")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //     .call(zoom);

    window.requestAnimationFrame(update);
}

var playedNotes = {
    "first": false,
    "second": false,
    "third": false,
    "fourth": false
};

function update() {
    var xPos = width - 14 - graphAreaMargin;

    if (brushX + 32 < width) {
        brushX = brushX + 0.15;

        minimap.select("g.brush")
            .call(brush.move, [brushX, brushX + 32]);
    }

    var circleMenPoint = findYatX(xPos, pathMen);
    var circleWomenPoint = findYatX(xPos, pathWomen);
    var circleChildrenPoint = findYatX(xPos, pathChildren);
    var circleElderlyPoint = findYatX(xPos, pathElderly);

    var currentDate = x.invert(xPos).getDate();

    switch (currentDate) {
        case 1:
            if (!playedNotes.first) {
                playNote(channels.men, mapNote(0, height, circleMenPoint.y), 127, 0, 0, 0.75);
                playNote(channels.women, mapNote(0, height, circleWomenPoint.y), 127, 0, 0, 0.75);
                playNote(channels.children, mapNote(0, height, circleChildrenPoint.y), 127, 0, 0, 0.75);
                playNote(channels.elderly, mapNote(0, height, circleElderlyPoint.y), 127, 0, 0, 0.75);

                playedNotes.first = true;
                playedNotes.fourth = false;
            }
            break;
        case 9:
            if (!playedNotes.second) {
                playNote(channels.men, mapNote(0, height, circleMenPoint.y), 127, 0, 0, 0.75);
                playNote(channels.women, mapNote(0, height, circleWomenPoint.y), 127, 0, 0, 0.75);
                playNote(channels.children, mapNote(0, height, circleChildrenPoint.y), 127, 0, 0, 0.75);
                playNote(channels.elderly, mapNote(0, height, circleElderlyPoint.y), 127, 0, 0, 0.75);

                playedNotes.second = true;
                playedNotes.first = false;
            }
            break;
        case 17:
            if (!playedNotes.third) {
                playNote(channels.men, mapNote(0, height, circleMenPoint.y), 127, 0, 0, 0.75);
                playNote(channels.women, mapNote(0, height, circleWomenPoint.y), 127, 0, 0, 0.75);
                playNote(channels.children, mapNote(0, height, circleChildrenPoint.y), 127, 0, 0, 0.75);
                playNote(channels.elderly, mapNote(0, height, circleElderlyPoint.y), 127, 0, 0, 0.75);

                playedNotes.third = true;
                playedNotes.second = false;
            }
            break;
        case 25:
            if (!playedNotes.fourth) {
                playNote(channels.men, mapNote(0, height, circleMenPoint.y), 127, 0, 0, 0.75);
                playNote(channels.women, mapNote(0, height, circleWomenPoint.y), 127, 0, 0, 0.75);
                playNote(channels.children, mapNote(0, height, circleChildrenPoint.y), 127, 0, 0, 0.75);
                playNote(channels.elderly, mapNote(0, height, circleElderlyPoint.y), 127, 0, 0, 0.75);

                playedNotes.fourth = true;
                playedNotes.third = false;
            }
            break;
    }

    circleMenRefugees.attr("cx", xPos)
        .attr("cy", circleMenPoint.y);

    circleMenDepandants.attr("cx", xPos)
        .attr("cy", circleMenPoint.y);

    circleWomenRefugees.attr("cx", xPos)
        .attr("cy", circleWomenPoint.y);

    circleWomenDepandants.attr("cx", xPos)
        .attr("cy", circleWomenPoint.y);

    circleChildrenRefugees.attr("cx", xPos)
        .attr("cy", circleChildrenPoint.y);

    circleChildrenDepandants.attr("cx", xPos)
        .attr("cy", circleChildrenPoint.y);

    circleElderlyRefugees.attr("cx", xPos)
        .attr("cy", circleElderlyPoint.y);

    circleElderlyDepandants.attr("cx", xPos)
        .attr("cy", circleElderlyPoint.y);

    window.requestAnimationFrame(update);
}

function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom

    var transitionEaseLinear = d3.transition()
        .duration(transformTransitionDuration)
        .ease(transformTransition);

    var s = d3.event.selection || xMinimap.range();
    x.domain(s.map(xMinimap.invert, xMinimap));

    pathMen.transition(transitionEaseLinear).attr("d", menValueLine);
    pathWomen.transition(transitionEaseLinear).attr("d", womenValueLine);
    pathChildren.transition(transitionEaseLinear).attr("d", childrenValueLine);
    pathElderly.transition(transitionEaseLinear).attr("d", elderlyValueLine);

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

// Get Y at given X on curved line
function findYatX(x, path) {
    var pathEl = path.node();

    var pathLength = pathEl.getTotalLength();
    var BBox = pathEl.getBBox();
    var scale = pathLength / BBox.width;

    var beginning = x,
        end = pathLength,
        target,
        pos;
    while (true) {
        target = Math.floor((beginning + end) / 2);
        pos = pathEl.getPointAtLength(target);

        if ((target === end || target === beginning) && pos.x !== x) {
            break;
        }

        if (pos.x > x) end = target;
        else if (pos.x < x) beginning = target;
        else {
            break;
        }
    }

    return pos;
}

function yAxisPadding(maxValue) {
    return maxValue * yAxisPaddingFactor;
}