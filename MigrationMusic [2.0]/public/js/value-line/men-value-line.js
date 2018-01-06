function MenValueLine(x, y) {
    this.line = d3.line()
        .x(function (d) {
            return x(d.period);
        })
        .y(function (d) {
            return y(d.men);
        })
        .curve(d3.curveCardinal);

    return this.line;
}