import { MIDI } from "./midi.js";

// Create a new instance of MIDI::class
const midi = new MIDI();

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

// loop through each track
for (const track of tracks) {
  // get these info per track
  const trackName = track.trackName;
  const instrument = track.instrument;
  const events = track.events;
  const notes = track.notes;

  // your code here
  // check types.ts
}
