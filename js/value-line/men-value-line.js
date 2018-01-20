function MenValueLine(x, y) {
    this.line = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            if (showRefugees && showDepandants) {
                return y(d.menTotal);
            } else if (showRefugees) {
                return y(d.menRefugees);
            } else if (showDepandants) {
                return y(d.menDepandants);
            }
        })
        .curve(d3.curveCardinal);

    return this.line;
}