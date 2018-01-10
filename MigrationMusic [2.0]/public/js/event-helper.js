var i = 0;
var text = '';
var currentEventIndex = -1;

function typeEventText() {
    if (i < text.length) {
        document.querySelector("#events").innerHTML += text.charAt(i);
        document.querySelector("#events").innerHTML += text.charAt(i + 1);
        i += 2;
    }
}

function changeEventText(index, newText) {
    clearEventText();
    i = 0;
    text = newText;
    currentEventIndex = index;
}

function clearEventText() {
    document.querySelector("#events").innerHTML = '';
}