var instrumentNames = [
    // "violin",
    "honkytonk_piano",
    // "acoustic_guitar_steel",
    "marimba",
    "banjo",
    "cello"
    // "clarinet",
    // "clavinet",
    // "contrabass",
    // "distortion_guitar",
    // "harmonica",
    // "honkytonk_piano",
    // "kalimba",
    // "koto"
];

var channels = {
    "men": 0,
    "women": 1,
    "children": 2,
    "elderly": 3
};

var octave = 12;
var totalNotes = 128;
var maxVolume = 127;

function initMidi(callback) {
    console.log("Initializing MIDI.js...");

    // Adding map function to Javascript
    Number.prototype.map = function (in_min, in_max, out_min, out_max) {
        return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    MIDI.loadPlugin({
        soundfontUrl: "../soundfont/FluidR3_GM/",
        instrument: instrumentNames,
        onprogress: function (state, progress) {
            console.log(state, progress);
        },
        onsuccess: function () {
            var delay = 0; // play one note every quarter second
            var note = 50; // the MIDI note
            var velocity = 127; // how hard the note hits

            MIDI.programChange(0, MIDI.GM.byName[instrumentNames[channels.men]].number); // set channel 0 to instrumentMen
            MIDI.programChange(1, MIDI.GM.byName[instrumentNames[channels.women]].number); // set channel 1 to instrumentWomen
            MIDI.programChange(2, MIDI.GM.byName[instrumentNames[channels.children]].number); // set channel 1 to instrumentChildren
            MIDI.programChange(3, MIDI.GM.byName[instrumentNames[channels.elderly]].number); // set channel 1 to instrumentElderly

            // playNote(channels.men, 50, velocity, delay, 0, 0.75);
            // playNote(channels.women, 55, velocity, delay, 0, 0.75);
            // playNote(channels.children, 60, velocity, delay, 0, 0.75);
            // playNote(channels.elderly, 65, velocity, delay, 0, 0.75);

            callback();
        }
    });
};

function playNote(channel, note, volume, delay, length) {
    MIDI.noteOn(channel, note, volume, delay);
    MIDI.noteOff(channel, note, delay + length);
}

function mapNote(min, max, value) {
    return Math.round(value.map(min, max, 60, totalNotes - 1 - 24));
}

function mapVolume(min, max, value) {
    return Math.round(value.map(min, max, 1, maxVolume));
}