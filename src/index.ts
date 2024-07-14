import { MIDI } from "./midi.js";

(async () => {
  const midi = new MIDI();
  await midi.readMidiData("Pretender.mid");
  //   await midi.parseFile("Pretender.mid");

  console.log(midi.getMidiData());
  console.log(midi.getMidiData()?.byteLength);
})();
