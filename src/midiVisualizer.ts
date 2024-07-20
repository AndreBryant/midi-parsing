import type { MIDIEvent, MIDINote, MIDITrack } from "./types.js";

export class MIDIVisualizer {
  private static sequence: string[] = new Array(128).fill("_");
  private static startTime: number = 0;
  private static midiTracks: MIDITrack[] = [];
  private static intervalId: NodeJS.Timeout;
  private static elapsedTime = 0;

  static visualize(midi: MIDITrack[], interval: number = 16) {
    this.midiTracks = midi;
    this.startTime = Date.now();
    this.intervalId = setInterval(this.animate.bind(this), interval);
  }

  private static animate() {
    this.elapsedTime += 1000;

    // Reset the sequence for the current frame
    this.sequence.fill("_");

    for (const track of this.midiTracks) {
      for (const note of track.notes) {
        if (
          note.startTime <= this.elapsedTime &&
          this.elapsedTime <= note.startTime + note.duration
        ) {
          this.sequence[note.key] = "||";
        }
      }
    }

    console.clear();
    console.log(`Elapsed Time: ${MIDIVisualizer.elapsedTime} ms`);
    console.log("Sequence: \n", this.sequence.join(""));
  }

  static stop() {
    clearInterval(this.intervalId);
  }
}
