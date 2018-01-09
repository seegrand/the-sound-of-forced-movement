var legendaMen;
var legendaWomen;
var legendaChildren;
var legendaElderly;

var legendaRefugees;
var legendaDepandants;

function initInteraction() {
    legendaMen = document.querySelector("#legenda > svg > g#men");
    legendaMen.addEventListener("click", switchShowMen);

    legendaWomen = document.querySelector("#legenda > svg > g#women");
    legendaWomen.addEventListener("click", switchShowWomen);

    legendaChildren = document.querySelector("#legenda > svg > g#children");
    legendaChildren.addEventListener("click", switchShowChildren);

    legendaElderly = document.querySelector("#legenda > svg > g#elderly");
    legendaElderly.addEventListener("click", switchShowElderly);

    legendaRefugees = document.querySelector("#legenda > svg > g#refugees");
    legendaRefugees.addEventListener("click", switchShowRefugees);

    legendaDepandants = document.querySelector("#legenda > svg > g#depandants");
    legendaDepandants.addEventListener("click", switchShowDepandants);

}

function switchShowMen() {
    if (showMen) {
        showMen = false;
        legendaMen.classList.add("disabled");

        pathMen.classed("hide", true);
        circleMenRefugees.classed("hide", true);
        circleMenDepandants.classed("hide", true);
        textMen.classed("hide", true);
    } else {
        showMen = true;
        legendaMen.classList.remove("disabled");

        pathMen.classed("hide", false);
        circleMenRefugees.classed("hide", false);
        circleMenDepandants.classed("hide", false);
        textMen.classed("hide", false);
    }

    updateMinimap();
}

function switchShowWomen() {
    if (showWomen) {
        showWomen = false;
        legendaWomen.classList.add("disabled");

        pathWomen.classed("hide", true);
        circleWomenRefugees.classed("hide", true);
        circleWomenDepandants.classed("hide", true);
        textWomen.classed("hide", true);
    } else {
        showWomen = true;
        legendaWomen.classList.remove("disabled");

        pathWomen.classed("hide", false);
        circleWomenRefugees.classed("hide", false);
        circleWomenDepandants.classed("hide", false);
        textWomen.classed("hide", false);
    }

    updateMinimap();
}

function switchShowChildren() {
    if (showChildren) {
        showChildren = false;
        legendaChildren.classList.add("disabled");

        pathChildren.classed("hide", true);
        circleChildrenRefugees.classed("hide", true);
        circleChildrenDepandants.classed("hide", true);
        textChildren.classed("hide", true);
    } else {
        showChildren = true;
        legendaChildren.classList.remove("disabled");

        pathChildren.classed("hide", false);
        circleChildrenRefugees.classed("hide", false);
        circleChildrenDepandants.classed("hide", false);
        textChildren.classed("hide", false);
    }

    updateMinimap();
}

function switchShowElderly() {
    if (showElderly) {
        showElderly = false;
        legendaElderly.classList.add("disabled");

        pathElderly.classed("hide", true);
        circleElderlyRefugees.classed("hide", true);
        circleElderlyDepandants.classed("hide", true);
        textElderly.classed("hide", true);
    } else {
        showElderly = true;
        legendaElderly.classList.remove("disabled");

        pathElderly.classed("hide", false);
        circleElderlyRefugees.classed("hide", false);
        circleElderlyDepandants.classed("hide", false);
        textElderly.classed("hide", false);
    }

    updateMinimap();
}

function switchShowRefugees() {
    if (showRefugees) {
        if (!showDepandants) {
            showDepandants = true;
            legendaDepandants.classList.remove("disabled");
        }

        showRefugees = false;
        legendaRefugees.classList.add("disabled");
    } else {
        showRefugees = true;
        legendaRefugees.classList.remove("disabled");
    }

    updateMinimap();
}

function switchShowDepandants() {
    if (showDepandants) {
        if (!showRefugees) {
            showRefugees = true;
            legendaRefugees.classList.remove("disabled");
        }

        showDepandants = false;
        legendaDepandants.classList.add("disabled");
    } else {
        showDepandants = true;
        legendaDepandants.classList.remove("disabled");
    }

    updateMinimap();
}