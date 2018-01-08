function MenValueLine(x, y) {
    this.line = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            if (showRefugees && showDepandants) {
                return y(d.menTotal);
            }

            if (showRefugees) {
                return y(d.menshowRefugees);
            }

            if (showDepandants) {
                return y(d.menshowDepandants);
            }
        })
        .curve(d3.curveCardinal);

    return this.line;
}