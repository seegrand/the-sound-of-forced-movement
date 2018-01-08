var selectedCountry = 0;

var countries = [{
    "name": "Syria",
    "data_link": "https://docs.google.com/spreadsheets/d/1SHtQ-5OcHhpzP0swlP_qEUECP5wPOY1PiRG53_7R3-4/edit?usp=sharing"
}];

function initData(callback) {
    Tabletop.init({
        key: countries[selectedCountry].data_link,
        callback: function (data, tabletop) {
            console.log(data);
            refugees = data;
            callback();
        },
        simpleSheet: true,
        parseNumbers: true
    });

    setCountryName();
}

function setCountryName() {
    document.querySelector("#country").innerHTML = countries[selectedCountry].name;
}