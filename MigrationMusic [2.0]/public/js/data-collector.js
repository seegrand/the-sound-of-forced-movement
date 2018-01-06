function init(callback) {
    Tabletop.init({
        key: 'https://docs.google.com/spreadsheets/d/1SHtQ-5OcHhpzP0swlP_qEUECP5wPOY1PiRG53_7R3-4/edit?usp=sharing',
        callback: function (data, tabletop) {
            console.log(data);
            refugees = data;
            callback();
        },
        simpleSheet: true,
        parseNumbers: true
    });
}