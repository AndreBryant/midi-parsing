import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { MIDIEventTypes, EventNames } from "./enums/midiEnums.js";
import type { uint8, uint16, uint32, int8, int16, int32 } from "./types";
import type { MIDIEvent } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MIDI {
  private midiBuffer: Buffer | null = null;
  private midiEvents: Buffer | null = null;
  private dataSize: number = 0;
  private position: number = 0;
  private noteCount = 0;
  private eof = false;

  constructor();
  constructor(filePath: string);
  constructor(filePath?: string) {
    if (filePath) this.readMidiData(filePath);
  }

  getMidiFileSize() {
    return this.midiBuffer?.byteLength ?? 0;
  }

  getNoteCount() {
    return this.noteCount;
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
    const { nFileId, nTrackChunks } = this.readMidiHeader();
    // TODO: needs better error handling like (stop reading if not a midi file)
    if (nFileId ^ 0x4d546864) {
      console.error("Not a midi File");
      return;
    }

    for (let i = 0; i < nTrackChunks && !this.eof; i++) {
      console.log("=====New Track=====");

      // Track Header Information
      const nTrackID = this.readBytes(4);
      const nTrackLength = this.readBytes(4);

      const checkpoint = this.position;
      let nPreviousStatus = 0;
      while (this.position < checkpoint + nTrackLength) {
        let nStatusTimeDelta = 0;
        let nStatus = 0;

        nStatusTimeDelta = this.readValue();
        nStatus = this.readNextByte() ?? 0;
        const statusCheck = nStatus & 0xf0;

        switch (statusCheck) {
          case EventNames.VoiceNoteOff:
            nPreviousStatus = nStatus;
            const nChannel = nStatus & 0x0f;
            const nNoteId = this.readNextByte();
            const nVelocity = this.readNextByte();

            // insert this to the midiEvents
            console.log(
              nStatusTimeDelta.toString(16),
              nChannel.toString(16),
              nNoteId?.toString(16),
              nVelocity?.toString(16)
            );
            break;
          case EventNames.VoiceNoteOn:
            break;
          case EventNames.VoiceAftertouch:
            break;
          case EventNames.VoiceControlChange:
            break;
          case EventNames.VoiceProgramChange:
            break;
          case EventNames.VoiceChannelPressure:
            break;
          case EventNames.VoicePitchBend:
            break;
          case EventNames.SystemExclusive:
            break;
          default:
            break;
        }
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
    //Manual Seeking in the Buffer
    let acc = 0;

    for (let i = 0; i < length; i++) {
      const byte = this.readNextByte() ?? 0;
      acc = (acc << 8) | byte;
    }

    return acc;
  }

  private readNextByte(): number | null {
    // Live Seeking in the Buffer
    if (this.midiBuffer && this.position < this.dataSize) {
      const byte = this.midiBuffer[this.position];
      this.position++;
      return byte;
    } else {
      this.eof = true;
      return null;
    }
  }

  private readValue() {
    let nValue = 0;
    let nByte = 0;

    nValue = this.readNextByte() ?? 0;

    if (nValue & 0x80) {
      // keep reading bytes while the MSB is 1
      // the last byte read should have 0 as its MSB
      do {
        nByte = this.readNextByte() ?? 0;
        nValue = (nValue << 8) | nByte;
      } while (nByte & 0x80);
    }

    return nValue;
  }
}
