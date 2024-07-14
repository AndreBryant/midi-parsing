import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { MIDIEventTypes } from "./enums/midiEnums.js";
import type { uint8, uint16, uint32, int8, int16, int32 } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MIDI {
  private midiBuffer: Buffer | null = null;
  private midiEvents: Buffer | null = null;
  private dataSize: number = 0;
  private position: number = 0;

  constructor() {}

  // DEBUG
  getMidiData() {
    return this.midiBuffer;
  }

  // sets the midi buffer
  readMidiData(filePath: string) {
    const absolutePath = path.resolve(__dirname, "../assets/midi", filePath);
    try {
      this.midiBuffer = fs.readFileSync(absolutePath);
      this.dataSize = this.midiBuffer?.byteLength;
    } catch (error) {
      return null;
    }
  }

  // returns JSON of the midi;
  private parseMidiData() {}

  // returns an Object containing an array of events and notes
  private interpretData() {}

  private readNextByte(): number {
    if (this.midiBuffer && this.position < this.dataSize) {
      const byte = this.midiBuffer[this.position];
      this.position++;
      return byte;
    } else {
      throw new Error("End of buffer reached");
    }
  }
}
