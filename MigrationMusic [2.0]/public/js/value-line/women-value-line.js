function WomenValueLine(x, y) {
    this.line = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            if (showRefugees && showDepandants) {
                return y(d.womenTotal);
            }

            if (showRefugees) {
                return y(d.womenshowRefugees);
            }

            if (showDepandants) {
                return y(d.womenshowDepandants);
            }
        })
        .curve(d3.curveCardinal);

    return this.line;
}