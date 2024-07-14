import { MIDI } from "./midi.js";

(async () => {
  const midi = new MIDI();
  midi.readMidiData("Pretender.mid");

  console.log(midi.getMidiData()?.byteLength);
  midi.parseMidiData();
})();
