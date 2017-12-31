function start(data) {

    // set the dimensions and margins of the graph
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        marginMinimap = {
            top: 430,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 2000 - margin.left - margin.right,
        height = 1300 - margin.top - margin.bottom,
        heightMinimap = 1300 - marginMinimap.top - marginMinimap.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the 1st line
    var menValueLine = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            return y(d.men);
        })
        .curve(d3.curveCardinal);

    // define the 2nd line
    var womenValueLine = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            return y(d.women);
        })
        .curve(d3.curveCardinal);

    var childrenValueLine = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            return y(d.children);
        })
        .curve(d3.curveCardinal);

    var elderlyValueLine = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            return y(d.elderly);
        })
        .curve(d3.curveCardinal);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(function (d) {
        d.period = parseTime(d.period);
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.period;
    }));
    y.domain([0, d3.max(data, function (d) {
        return Math.max(d.men);
    })]);

    // Add the menValueLine path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", menValueLine(data));

    // Add the womenValueLine path.
    svg.append("path")
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", womenValueLine(data));

    // Add the childrenValueLine path.
    svg.append("path")
        .attr("class", "line")
        .style("stroke", "yellow")
        .attr("d", childrenValueLine(data));

    // Add the elderlyValueLine path.
    svg.append("path")
        .attr("class", "line")
        .style("stroke", "green")
        .attr("d", elderlyValueLine(data));

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

}