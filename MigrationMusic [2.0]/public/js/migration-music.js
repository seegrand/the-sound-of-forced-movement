var data;

var svgWidth = 1500;
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

var paused = false;

var showMen = true;
var showWomen = true;
var showChildren = true;
var showElderly = true;

var showRefugees = true;
var showDepandants = true;

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

var textMen;
var textWomen;
var textChildren;
var textElderly;

var menValueLine;
var womenValueLine;
var childrenValueLine;
var elderlyValueLine;

var pathMenMinimap;
var pathWomenMinimap;
var pathChildrenMinimap;
var pathElderlyMinimap;

var menValueLineMinimap;
var womenValueLineMinimap;
var childrenValueLineMinimap;
var elderlyValueLineMinimap;

function start(refugees) {
    data = refugees;

    console.log(data);

    this.transformTransition = d3.easeLinear;
    this.transformTransitionDuration = 1000;

    // Set the dimensions and margins of the graph
    margin = {
        top: 20,
        right: 60,
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
        .attr("width", width)
        .attr("height", height);

    focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    minimap = svg.append("g")
        .attr("class", "minimap")
        .attr("transform", "translate(" + marginMinimap.left + "," + marginMinimap.top + ")");

    // Parse the date / time
    var parseTime = d3.timeParse("%Y-%m");

    // Format the data
    data.forEach(function (d) {
        d.period = parseTime(d.period);
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.period;
    }));
    y.domain([0, d3.max(data, function (d) {
        return calculateDomainY(d);
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

    focus.append("rect")
        .attr("class", "cover")
        .attr("x", width - graphAreaMargin)
        .attr("y", 0)
        .attr("width", graphAreaMargin)
        .attr("height", height);

    focus.append("text")
        .attr("class", "axis axis--label")
        .attr("transform", "rotate(-90)")
        .attr("y", (width - 25))
        .attr("x", 0 - 175)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Monthly asylum request in the Netherlands");

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

    textMen = focus.append("text")
        .attr("id", "men");

    textWomen = focus.append("text")
        .attr("id", "women");

    textChildren = focus.append("text")
        .attr("id", "children");

    textElderly = focus.append("text")
        .attr("id", "elderly");

    minimap.append("g")
        .attr("class", "axis axis--white axis--x")
        .attr("transform", "translate(0," + heightMinimap + ")")
        .call(xAxisMinimap);

    pathMenMinimap = minimap.append("path")
        .datum(data)
        .attr("id", "men")
        .attr("class", "line")
        .attr("d", menValueLineMinimap);

    pathWomenMinimap = minimap.append("path")
        .datum(data)
        .attr("id", "women")
        .attr("class", "line")
        .attr("d", womenValueLineMinimap);

    pathChildrenMinimap = minimap.append("path")
        .datum(data)
        .attr("id", "children")
        .attr("class", "line")
        .attr("d", childrenValueLineMinimap);

    pathElderlyMinimap = minimap.append("path")
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

    initControls();
    initInteraction();

    window.requestAnimationFrame(update);
}

var playedNotes = {
    "first": false,
    "second": false,
    "third": false,
    "fourth": false,
    "fifth": false,
    "sixth": false,
    "seventh": false
};

function update() {
    var xPos = width - 14 - graphAreaMargin;
    var textLeftMargin = 50;
    var textTopMargin = 10;

    if (!paused) {
        if (brushX + 32 < width) {
            brushX = brushX + 0.1;

            minimap.select("g.brush")
                .call(brush.move, [brushX, brushX + 32]);
        }
    }

    var circleMenPoint = findYatX(xPos, pathMen);
    var circleWomenPoint = findYatX(xPos, pathWomen);
    var circleChildrenPoint = findYatX(xPos, pathChildren);
    var circleElderlyPoint = findYatX(xPos, pathElderly);

    var currentDate = x.invert(xPos).getDate();

    var maxHeight = height - 200;
    var noteLength = 1000;

    var menDelay = 0;
    var womenDelay = 0;
    var childrenDelay = 0;
    var elderlyDelay = 0;

    var menValue = Math.round(circleMenPoint.y.map(height, 0, 0, y.domain()[1]));
    var womenValue = Math.round(circleWomenPoint.y.map(height, 0, 0, y.domain()[1]));
    var childrenValue = Math.round(circleChildrenPoint.y.map(height, 0, 0, y.domain()[1]));
    var elderlyValue = Math.round(circleElderlyPoint.y.map(height, 0, 0, y.domain()[1]));

    var bisectDate = d3.bisector(function (d) {
        return d.period;
    }).left;

    var x0 = x.invert(xPos),
        index = bisectDate(data, x0, 1);

    switch (currentDate) {
        case 1:
            if (!playedNotes.first) {
                playNote(channels.men, mapNote(maxHeight, 0, circleMenPoint.y, index), mapVolume(maxHeight, 0, circleMenPoint.y), menDelay, noteLength);
                playNote(channels.women, mapNote(maxHeight, 0, circleWomenPoint.y, index), mapVolume(maxHeight, 0, circleMenPoint.y), womenDelay, noteLength);
                playNote(channels.children, mapNote(maxHeight, 0, circleChildrenPoint.y, index), mapVolume(maxHeight, 0, circleMenPoint.y), childrenDelay, noteLength);
                playNote(channels.elderly, mapNote(maxHeight, 0, circleElderlyPoint.y, index), mapVolume(maxHeight, 0, circleMenPoint.y), elderlyDelay, noteLength);

                playedNotes.first = true;
                playedNotes.seventh = false;
            }
            break;
        case 4:
            if (!playedNotes.second) {
                playNote(channels.men, mapNote(maxHeight, 0, circleMenPoint.y, index), mapVolume(maxHeight, 0, circleMenPoint.y), menDelay, noteLength);
                playNote(channels.women, mapNote(maxHeight, 0, circleWomenPoint.y, index), mapVolume(maxHeight, 0, circleWomenPoint.y), womenDelay, noteLength);
                playNote(channels.children, mapNote(maxHeight, 0, circleChildrenPoint.y, index), mapVolume(maxHeight, 0, circleChildrenPoint.y), childrenDelay, noteLength);
                playNote(channels.elderly, mapNote(maxHeight, 0, circleElderlyPoint.y, index), mapVolume(maxHeight, 0, circleElderlyPoint.y), elderlyDelay, noteLength);

                playedNotes.second = true;
                playedNotes.first = false;
            }
            break;
        case 8:
            if (!playedNotes.third) {
                playNote(channels.men, mapNote(maxHeight, 0, circleMenPoint.y, index), mapVolume(maxHeight, 0, circleMenPoint.y), menDelay, noteLength);
                playNote(channels.women, mapNote(maxHeight, 0, circleWomenPoint.y, index), mapVolume(maxHeight, 0, circleWomenPoint.y), womenDelay, noteLength);
                playNote(channels.children, mapNote(maxHeight, 0, circleChildrenPoint.y, index), mapVolume(maxHeight, 0, circleChildrenPoint.y), childrenDelay, noteLength);
                playNote(channels.elderly, mapNote(maxHeight, 0, circleElderlyPoint.y, index), mapVolume(maxHeight, 0, circleElderlyPoint.y), elderlyDelay, noteLength);

                playedNotes.third = true;
                playedNotes.second = false;
            }
            break;
        case 12:
            if (!playedNotes.fourth) {
                playNote(channels.men, mapNote(maxHeight, 0, circleMenPoint.y, index), mapVolume(maxHeight, 0, circleMenPoint.y), menDelay, noteLength);
                playNote(channels.women, mapNote(maxHeight, 0, circleWomenPoint.y, index), mapVolume(maxHeight, 0, circleWomenPoint.y), womenDelay, noteLength);
                playNote(channels.children, mapNote(maxHeight, 0, circleChildrenPoint.y, index), mapVolume(maxHeight, 0, circleChildrenPoint.y), childrenDelay, noteLength);
                playNote(channels.elderly, mapNote(maxHeight, 0, circleElderlyPoint.y, index), mapVolume(maxHeight, 0, circleElderlyPoint.y), elderlyDelay, noteLength);

                playedNotes.fourth = true;
                playedNotes.third = false;
            }
            break;
        case 18:
            if (!playedNotes.fifth) {
                playNote(channels.men, mapNote(maxHeight, 0, circleMenPoint.y, index), mapVolume(maxHeight, 0, circleMenPoint.y), menDelay, noteLength);
                playNote(channels.women, mapNote(maxHeight, 0, circleWomenPoint.y, index), mapVolume(maxHeight, 0, circleWomenPoint.y), womenDelay, noteLength);
                playNote(channels.children, mapNote(maxHeight, 0, circleChildrenPoint.y, index), mapVolume(maxHeight, 0, circleChildrenPoint.y), childrenDelay, noteLength);
                playNote(channels.elderly, mapNote(maxHeight, 0, circleElderlyPoint.y, index), mapVolume(maxHeight, 0, circleElderlyPoint.y), elderlyDelay, noteLength);

                playedNotes.fifth = true;
                playedNotes.fourth = false;
            }
            break;
        case 22:
            if (!playedNotes.sixth) {
                playNote(channels.men, mapNote(maxHeight, 0, circleMenPoint.y, index), mapVolume(maxHeight, 0, circleMenPoint.y), menDelay, noteLength);
                playNote(channels.women, mapNote(maxHeight, 0, circleWomenPoint.y, index), mapVolume(maxHeight, 0, circleWomenPoint.y), womenDelay, noteLength);
                playNote(channels.children, mapNote(maxHeight, 0, circleChildrenPoint.y, index), mapVolume(maxHeight, 0, circleChildrenPoint.y), childrenDelay, noteLength);
                playNote(channels.elderly, mapNote(maxHeight, 0, circleElderlyPoint.y, index), mapVolume(maxHeight, 0, circleElderlyPoint.y), elderlyDelay, noteLength);

                playedNotes.sixth = true;
                playedNotes.fifth = false;
            }
            break;
        case 28:
            if (!playedNotes.seventh) {
                playNote(channels.men, mapNote(maxHeight, 0, circleMenPoint.y, index), mapVolume(maxHeight, 0, circleMenPoint.y), menDelay, noteLength);
                playNote(channels.women, mapNote(maxHeight, 0, circleWomenPoint.y, index), mapVolume(maxHeight, 0, circleWomenPoint.y), womenDelay, noteLength);
                playNote(channels.children, mapNote(maxHeight, 0, circleChildrenPoint.y, index), mapVolume(maxHeight, 0, circleChildrenPoint.y), childrenDelay, noteLength);
                playNote(channels.elderly, mapNote(maxHeight, 0, circleElderlyPoint.y, index), mapVolume(maxHeight, 0, circleElderlyPoint.y), elderlyDelay, noteLength);

                playedNotes.seventh = true;
                playedNotes.sixth = false;
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

    textMen.attr("x", (xPos + textLeftMargin))
        .attr("y", (circleMenPoint.y) + textTopMargin)
        .text(menValue);

    textWomen.attr("x", (xPos + textLeftMargin))
        .attr("y", (circleWomenPoint.y) + textTopMargin)
        .text(womenValue);

    textChildren.attr("x", (xPos + textLeftMargin))
        .attr("y", (circleChildrenPoint.y) + textTopMargin)
        .text(childrenValue);

    textElderly.attr("x", (xPos + textLeftMargin))
        .attr("y", (circleElderlyPoint.y) + textTopMargin)
        .text(elderlyValue);

    // ====================== EVENTS ======================
    if (index - 1 != currentEventIndex && data[index - 1].events != "") {
        changeEventText(index - 1, data[index - 1].events);
    }

    typeTextEvent();

    window.requestAnimationFrame(update);
}

function updateMinimap() {
    yMinimap.domain([0, d3.max(data, function (d) {
        return calculateDomainY(d, false);
    })]);

    var transitionEaseLinear = d3.transition()
        .duration(transformTransitionDuration)
        .ease(transformTransition);

    pathMenMinimap.transition(transitionEaseLinear).attr("d", menValueLineMinimap);
    pathWomenMinimap.transition(transitionEaseLinear).attr("d", womenValueLineMinimap);
    pathChildrenMinimap.transition(transitionEaseLinear).attr("d", childrenValueLineMinimap);
    pathElderlyMinimap.transition(transitionEaseLinear).attr("d", elderlyValueLineMinimap);
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
            return calculateDomainY(d);
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
        return calculateDomainY(d);
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

function calculateDomainY(d, filter = true) {
    var domainTotal = [];
    domainTotal[0] = d.menTotal;
    domainTotal[1] = d.womenTotal;
    domainTotal[2] = d.childrenTotal;
    domainTotal[3] = d.elderlyTotal;

    var domainRefugees = [];
    domainRefugees[0] = d.menRefugees;
    domainRefugees[1] = d.womenRefugees;
    domainRefugees[2] = d.childrenRefugees;
    domainRefugees[3] = d.elderlyRefugees;

    var domainDepandants = [];
    domainDepandants[0] = d.menDepandants;
    domainDepandants[1] = d.womenDepandants;
    domainDepandants[2] = d.childrenDepandants;
    domainDepandants[3] = d.elderlyDepandants;

    if (filter) {
        if (!showMen) {
            remove(domainTotal, d.menTotal);
            remove(domainRefugees, d.menRefugees);
            remove(domainDepandants, d.menDepandants);
        }

        if (!showWomen) {
            remove(domainTotal, d.womenTotal);
            remove(domainRefugees, d.womenRefugees);
            remove(domainDepandants, d.womenDepandants);
        }

        if (!showChildren) {
            remove(domainTotal, d.childrenTotal);
            remove(domainRefugees, d.childrenRefugees);
            remove(domainDepandants, d.childrenDepandants);
        }

        if (!showElderly) {
            remove(domainTotal, d.elderlyTotal);
            remove(domainRefugees, d.elderlyRefugees);
            remove(domainDepandants, d.elderlyDepandants);
        }
    }

    if (showRefugees && showDepandants) {
        var max = domainTotal.reduce(function (a, b) {
            return Math.max(a, b);
        });

        max += yAxisPadding(domainTotal.reduce(function (a, b) {
            return Math.max(a, b);
        }));

        return max;
    } else if (showRefugees) {
        var max = domainRefugees.reduce(function (a, b) {
            return Math.max(a, b);
        });

        max += yAxisPadding(domainRefugees.reduce(function (a, b) {
            return Math.max(a, b);
        }));

        return max;
    } else if (showDepandants) {
        var max = domainDepandants.reduce(function (a, b) {
            return Math.max(a, b);
        });

        max += yAxisPadding(domainDepandants.reduce(function (a, b) {
            return Math.max(a, b);
        }));

        return max;
    }
}

function yAxisPadding(maxValue) {
    return maxValue * yAxisPaddingFactor;
}

function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}