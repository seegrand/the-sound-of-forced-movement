function ChildrenValueLine(x, y) {
    this.line = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            if (showRefugees && showDepandants) {
                return y(d.childrenTotal);
            }

            if (showRefugees) {
                return y(d.childrenshowRefugees);
            }

            if (showDepandants) {
                return y(d.childrenshowDepandants);
            }
        })
        .curve(d3.curveCardinal);

    return this.line;
}