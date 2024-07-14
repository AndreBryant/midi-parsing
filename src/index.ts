import { MIDI } from "./midi.js";

(async () => {
  const midi = new MIDI();
  midi.readMidiData("Pretender.mid");
  console.log("midi file size: ", midi.getMidiFileSize() / 1000 + "kb");
  midi.parseMidiData();
})();
