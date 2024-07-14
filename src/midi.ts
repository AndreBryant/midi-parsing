import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { MIDIEventTypes } from "./enums/midiEnums.js";
import type { uint8, uint16, uint32, int8, int16, int32 } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://ccrma.stanford.edu/~craig/14q/midifile/MidiFileFormat.html#:~:text=Header%20Chunk,-The%20header%20chunk&text=These%20four%20characters%20at%20the,this%20is%20a%20MIDI%20file.&text=length%20of%20the%20header%20chunk,of%20the%20next%20three%20fields).
export class MIDI {
  private midiBuffer: Buffer | null = null;
  private midiEvents: Buffer | null = null;
  private dataSize: number = 0;
  private position: number = 0;

  constructor();
  constructor(filePath: string);
  constructor(filePath?: string) {
    if (filePath) this.readMidiData(filePath);
  }

  getMidiData() {
    return this.midiBuffer;
  }

  readMidiData(filePath: string) {
    const absolutePath = path.resolve(__dirname, "../assets/midi", filePath);
    try {
      this.midiBuffer = fs.readFileSync(absolutePath);
      this.dataSize = this.midiBuffer?.byteLength;
    } catch (error) {
      console.log("Error: ", error);
      return null;
    }
  }

  parseMidiData() {
    this.position = 0;
    const { nFileId, nHeaderLength, nFormat, nTrackChunks, nDivision } =
      this.readMidiHeader();

    for (let i = 0; i < nTrackChunks; i++) {
      console.log("=====New Track=====");

      let nTrackID = this.readBytes(4);
      let nTrackLength = this.readBytes(4);

      console.log(nTrackID.toString(16), nTrackLength.toString(16));
      for (let i = 0; i < nTrackLength; i++) {
        this.readNextByte();
      }
    }
  }

  interpretMidi() {}

  private readMidiHeader() {
    this.position = 0;

    let nFileId = this.readBytes(4);
    let nHeaderLength = this.readBytes(4);
    let nFormat = this.readBytes(2);
    let nTrackChunks = this.readBytes(2);
    let nDivision = this.readBytes(2);

    return { nFileId, nHeaderLength, nFormat, nTrackChunks, nDivision };
  }

  private readBytes(length: number) {
    let acc = 0;

    for (let i = 0; i < length; i++) {
      const byte = this.readNextByte();
      acc = (acc << 8) | byte;
    }

    return acc;
  }

  private readNextByte(): number {
    if (this.midiBuffer && this.position < this.dataSize) {
      const byte = this.midiBuffer[this.position];
      this.position++;
      return byte;
    } else {
      throw new Error("End of buffer reached");
    }
  }

  private readValue() {
    let nValue: number[] = [];
    let current = this.readNextByte();

    nValue.push(current);

    if (current & 0x80) {
      // keep reading bytes while the MSB is 1
      // the last byte read should have 0 as its MSB
      do {
        current = this.readNextByte();
        nValue.push(current);
      } while (current & 0x80);
    }
    return nValue;
  }
}
