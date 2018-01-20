var soundfontUrl = 'https://cdn.rawgit.com/seegrand/the-sound-of-forced-movement/gh-pages/soundfont/FluidR3_GM/';

var instrumentNames = [
    "acoustic_bass",
    "choir_aahs",
    "violin",
    "cello"
];

var channels = {
    "men": 0,
    "women": 1,
    "children": 2,
    "elderly": 3
};

var majorScaleE = [
    30, 32, 34, 35, 37, 39, 41,
    43, 45, 46, 48, 50, 52, 54,
    55, 57, 59, 61, 63, 65, 66,
    68, 70, 71, 73, 75, 77, 79,
    81, 82, 84, 86, 88, 90, 91,
    93, 95, 97, 99, 101, 102, 104,
    106, 107, 109, 111, 113, 115, 117
];

var majorScaleB = [
    35, 37, 39, 40, 42, 44, 46,
    48, 50, 51, 53, 55, 57, 59,
    60, 62, 64, 66, 68, 70, 71,
    73, 75, 76, 78, 80, 82, 84,
    86, 87, 89, 91, 93, 95, 96,
    98, 100, 102, 104, 106, 107, 109
];

var minorHarmonicScaleC = [
    36, 38, 39, 41, 43, 44, 47,
    48, 50, 51, 53, 55, 56, 59,
    60, 62, 63, 65, 67, 68, 71,
    72, 74, 75, 77, 79, 80, 83,
    84, 86, 87, 89, 91, 92, 95,
    96, 98, 99, 101, 103, 104, 107
];

var majorScaleA = [
    33, 35, 37, 38, 40, 42, 44,
    46, 48, 49, 51, 53, 55, 57,
    58, 60, 62, 64, 66, 68, 69,
    71, 73, 74, 76, 78, 80, 82,
    84, 85, 87, 89, 91, 93, 94,
    96, 98, 100, 102, 104, 105, 107
];

var scales = [
    majorScaleE,
    majorScaleB,
    minorHarmonicScaleC,
    majorScaleA
];

var selectedScale = 0;

var sections = [
    [0, 3],
    [4, 7],
    [8, 11],
    [12, 15],
    [16, 19],
    [20, 23],
    [24, 27],
    [28, 31],
    [32, 35],
    [36, 39],
    [40, 43],
    [44, 47],
    [48, 51],
    [52, 55],
    [56, 59]
]

var year = 12;
var totalNotes = 128;
var maxVolume = 127;

function initMidi(callback) {
    console.log("Initializing MIDI.js...");

    MIDI.loadPlugin({
        soundfontUrl: soundfontUrl,
        instrument: instrumentNames,
        onprogress: function (state, progress) {
            console.log(state, progress);
        },
        onsuccess: function () {
            MIDI.programChange(0, MIDI.GM.byName[instrumentNames[channels.men]].number); // set channel 0 to instrumentMen
            MIDI.programChange(1, MIDI.GM.byName[instrumentNames[channels.women]].number); // set channel 1 to instrumentWomen
            MIDI.programChange(2, MIDI.GM.byName[instrumentNames[channels.children]].number); // set channel 1 to instrumentChildren
            MIDI.programChange(3, MIDI.GM.byName[instrumentNames[channels.elderly]].number); // set channel 1 to instrumentElderly

            var delay = 0; // play one note every quarter second
            var note = 50; // the MIDI note
            var velocity = 127; // how hard the note hits

            // playNote(channels.men, 50, velocity, delay, 0, 0.75);
            // playNote(channels.women, 55, velocity, delay, 0, 0.75);
            // playNote(channels.children, 60, velocity, delay, 0, 0.75);
            // playNote(channels.elderly, 65, velocity, delay, 0, 0.75);

            callback();
        }
    });
};

function playNote(channel, note, volume, delay, length) {
    if (channel == channels.men && showMen ||
        channel == channels.women && showWomen ||
        channel == channels.children && showChildren ||
        channel == channels.elderly && showElderly) {

        // BOOST
        // if (channel == channels.women) {
        //     volume += 50;
        // }

        MIDI.noteOn(channel, note, volume, delay);
        MIDI.noteOff(channel, note, delay + length);
    }
}

function mapNote(min, max, value, index) {
    switchScale(index, data.length - 1);

    return mapToScale(Math.round(value.map(min, max, 29, 112)), scales[selectedScale]);
}

function switchScale(index, max) {
    for (var i = 0; i < sections.length; i++) {
        if (index > sections[i][0] && index < sections[i][1]) {
            selectedScale = index % (scales.length - 1);
        }
    }
}

function mapToScale(num, arr) {
    var curr = arr[0];
    var diff = Math.abs(num - curr);

    for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs(num - arr[val]);

        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
        }
    }

    return curr;
}

function mapVolume(min, max, value) {
    return Math.round(value.map(min, max, 50, maxVolume));
}