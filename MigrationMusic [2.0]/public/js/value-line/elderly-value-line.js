function ElderlyValueLine(x, y) {
    this.line = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            if (showRefugees && showDepandants) {
                return y(d.elderlyTotal);
            } else if (showRefugees) {
                return y(d.elderlyRefugees);
            } else if (showDepandants) {
                return y(d.elderlyDepandants);
            }
        })
        .curve(d3.curveCardinal);

    return this.line;
}