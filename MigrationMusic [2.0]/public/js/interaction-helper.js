var legendaMen;
var legendaWomen;
var legendaChildren;
var legendaElderly;

var legendaRefugees;
var legendaDepandants;

var creators;
var easterEggThreshold = 0;

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

    creators = document.querySelector('#creators');
    creators.addEventListener("click", easterEgg);
}

function switchShowMen() {
    if (showMen) {
        showMen = false;
        legendaMen.classList.add("disabled");

        pathMen.classed("disabled", true);
        circleMenRefugees.classed("disabled", true);
        circleMenDepandants.classed("disabled", true);
        textMen.classed("disabled", true);
    } else {
        showMen = true;
        legendaMen.classList.remove("disabled");

        pathMen.classed("disabled", false);
        circleMenRefugees.classed("disabled", false);
        circleMenDepandants.classed("disabled", false);
        textMen.classed("disabled", false);
    }

    updateMinimap();
}

function switchShowWomen() {
    if (showWomen) {
        showWomen = false;
        legendaWomen.classList.add("disabled");

        pathWomen.classed("disabled", true);
        circleWomenRefugees.classed("disabled", true);
        circleWomenDepandants.classed("disabled", true);
        textWomen.classed("disabled", true);
    } else {
        showWomen = true;
        legendaWomen.classList.remove("disabled");

        pathWomen.classed("disabled", false);
        circleWomenRefugees.classed("disabled", false);
        circleWomenDepandants.classed("disabled", false);
        textWomen.classed("disabled", false);
    }

    updateMinimap();
}

function switchShowChildren() {
    if (showChildren) {
        showChildren = false;
        legendaChildren.classList.add("disabled");

        pathChildren.classed("disabled", true);
        circleChildrenRefugees.classed("disabled", true);
        circleChildrenDepandants.classed("disabled", true);
        textChildren.classed("disabled", true);
    } else {
        showChildren = true;
        legendaChildren.classList.remove("disabled");

        pathChildren.classed("disabled", false);
        circleChildrenRefugees.classed("disabled", false);
        circleChildrenDepandants.classed("disabled", false);
        textChildren.classed("disabled", false);
    }

    updateMinimap();
}

function switchShowElderly() {
    if (showElderly) {
        showElderly = false;
        legendaElderly.classList.add("disabled");

        pathElderly.classed("disabled", true);
        circleElderlyRefugees.classed("disabled", true);
        circleElderlyDepandants.classed("disabled", true);
        textElderly.classed("disabled", true);
    } else {
        showElderly = true;
        legendaElderly.classList.remove("disabled");

        pathElderly.classed("disabled", false);
        circleElderlyRefugees.classed("disabled", false);
        circleElderlyDepandants.classed("disabled", false);
        textElderly.classed("disabled", false);
    }

    updateMinimap();
}

function switchShowRefugees() {
    if (showRefugees) {
        if (!showDepandants) {
            enableDepandants();
        }

        disableRefugees();
    } else {
        enableRefugees();
    }

    updateMinimap();
}

function switchShowDepandants() {
    if (showDepandants) {
        if (!showRefugees) {
            enableRefugees();
        }

        disableDepandants();
    } else {
        enableDepandants();
    }

    updateMinimap();
}

function disableRefugees() {
    showRefugees = false;
    legendaRefugees.classList.add("disabled");
    legendaRefugees.querySelector("circle.refugees").setAttribute("id", "dark");

    dashLines(true);
}

function enableRefugees() {
    showRefugees = true;
    legendaRefugees.classList.remove("disabled");
    legendaRefugees.querySelector("circle.refugees").setAttribute("id", "light");

    dashLines(false);
}

function disableDepandants() {
    showDepandants = false;
    legendaDepandants.classList.add("disabled");
    legendaDepandants.querySelector("circle.refugees").setAttribute("id", "dark");
}

function enableDepandants() {
    showDepandants = true;
    legendaDepandants.classList.remove("disabled");
    legendaDepandants.querySelector("circle.refugees").setAttribute("id", "light");
}

function dashLines(shouldDashLines) {
    pathMen.classed("dashed", shouldDashLines);
    pathWomen.classed("dashed", shouldDashLines);
    pathChildren.classed("dashed", shouldDashLines);
    pathElderly.classed("dashed", shouldDashLines);
}

function easterEgg() {
    easterEggThreshold++;

    if (easterEggThreshold == 3) {
        var audioFile = document.querySelector("audio#dikke-bmw");
        audioFile.play();
    }
}