import { MIDIParser } from "./midiParser.js";
import { MIDIVisualizer } from "./midiVisualizer.js";

// Create a new instance of MIDI::class
const midi = new MIDIParser();

// Read a midi file
midi.readMidiData("Pretender.mid");

// After reading the file, you can:

// get the midiFileSIze in bytes
const fileSize = midi.getMidiFileSize();

// parse the buffer of MIDI bytes.
midi.parseMidiData();

// after parsing, you can:
// get midi note count
const noteCount = midi.getNoteCount();

// get tracks
const tracks = midi.getTracks()!;

// MIDIVisualizer.visualize(tracks);

// Optionally, stop the visualization after a certain duration
// setTimeout(() => {
//   MIDIVisualizer.stop();
//   console.log("Visualization stopped.");
// }, 100000); // Stop after 10 seconds
