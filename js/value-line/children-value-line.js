function ChildrenValueLine(x, y) {
    this.line = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            if (showRefugees && showDepandants) {
                return y(d.childrenTotal);
            } else if (showRefugees) {
                return y(d.childrenRefugees);
            } else if (showDepandants) {
                return y(d.childrenDepandants);
            }
        })
        .curve(d3.curveCardinal);

    return this.line;
}