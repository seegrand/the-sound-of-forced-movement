var playButton;
var playButtonText;
var reloadButton;
var reloadButtonText;

function initControls() {
    // document.querySelector("#controls > div#play").addEventListener("click", playButtonEvent);

    playButton = document.querySelector("#controls > div#play > span.icon");
    playButton.addEventListener("click", playButtonEvent);

    playButtonText = document.querySelector("#controls > div#play > span.label");
    playButtonText.addEventListener("click", playButtonEvent);

    reloadButton = document.querySelector("#controls > div#reload > span.icon");
    reloadButton.addEventListener("click", reloadButtonEvent);

    reloadButtonText = document.querySelector("#controls > div#reload > span.label");
    reloadButtonText.addEventListener("click", reloadButtonEvent);
}

function playButtonEvent() {
    if (paused) {
        play();
    } else {
        pause();
    }
}

function play() {
    paused = false;

    playButton.innerHTML = '<i class="material-icons">pause</i>';
    playButtonText.innerHTML = 'Pause';
}

function pause() {
    paused = true;

    playButton.innerHTML = '<i class="material-icons">play_arrow</i>';
    playButtonText.innerHTML = 'Play';
}

function reloadButtonEvent() {
    reload();
}

function reload() {
    // Reset every variable

    // For now reloading page
    location.reload(false);
}