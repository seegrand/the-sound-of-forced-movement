var i = 0;
var charactersPerEvent = 3;
var text = '';
var currentEventIndex = -1;

function typeTextEvent() {
    for (var k = 0; k < charactersPerEvent; k++) {
        if (i < text.length) {
            if (text.charAt(i + k) == ';') {
                document.querySelector("#events").appendChild(document.createElement('br'));
            } else {
                document.querySelector("#events").innerHTML += text.charAt(i + k);
            }
        }
    }

    i += charactersPerEvent;
}

function changeEventText(index, newText) {
    if (i >= text.length) {
        clearEventText();
        i = 0;
        text = newText;
        currentEventIndex = index;
    }
}

function clearEventText() {
    document.querySelector("#events").innerHTML = '';
}