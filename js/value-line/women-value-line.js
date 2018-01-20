function WomenValueLine(x, y) {
    this.line = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            if (showRefugees && showDepandants) {
                return y(d.womenTotal);
            } else if (showRefugees) {
                return y(d.womenRefugees);
            } else if (showDepandants) {
                return y(d.womenDepandants);
            }
        })
        .curve(d3.curveCardinal);

    return this.line;
}