function ElderlyValueLine(x, y) {
    this.line = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            if (showRefugees && showDepandants) {
                return y(d.elderlyTotal);
            }

            if (showRefugees) {
                return y(d.elderlyshowRefugees);
            }

            if (showDepandants) {
                return y(d.elderlyshowDepandants);
            }
        })
        .curve(d3.curveCardinal);

    return this.line;
}