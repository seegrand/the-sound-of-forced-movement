function WomenValueLine(x, y) {
    this.line = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            return y(d.women);
        })
        .curve(d3.curveCardinal);

    return this.line;
}