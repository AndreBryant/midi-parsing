import { MIDI } from "./midi.js";

(async () => {
  const midi = new MIDI();
  await midi.parseFile("Pretender.mid");

  console.log(midi.getMidiData());
})();
