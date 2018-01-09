var playButton;
var reloadButton;

function initControls() {
    playButton = document.querySelector("#controls > #play");
    playButton.addEventListener("click", playButtonEvent);

    reloadButton = document.querySelector("#controls > #reload");
    reloadButton.addEventListener("click", reloadButtonEvent);
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
}

function pause() {
    paused = true;

    playButton.innerHTML = '<i class="material-icons">play_arrow</i>';
}

function reloadButtonEvent() {
    reload();
}

function reload() {
    // Reset every variable

    // For now reloading page
    location.reload(false);
}