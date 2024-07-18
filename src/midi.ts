import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { EventNames, MetaEvents } from "./enums/midiEnums.js";
import type { MIDIEvent, MIDINote, MIDITrack } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MIDI {
  private midiBuffer: Buffer | null = null;
  private midiTracks: MIDITrack[] | null = [];
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
    let noteCount = 0;
    if (this.midiTracks?.length !== 0) {
      this.midiTracks?.forEach((t) => (noteCount += t.notes.length));
    }
    return noteCount;
  }

  getTracks() {
    return this.midiTracks?.length !== 0 ? this.midiTracks : null;
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
      let events: MIDIEvent[] = [];
      let track: MIDITrack | null = null;

      console.log("New Track Found...");
      console.log(`Track #${this.midiTracks?.length}`);

      // Track Header Information
      const nTrackID = this.readBytes(4);
      const nTrackLength = this.readBytes(4);
      let nPreviousStatus = 0;

      const checkpoint = this.position;
      while (this.position < checkpoint + nTrackLength) {
        let nStatusTimeDelta = 0;
        let nStatus = 0;

        nStatusTimeDelta = this.readValue();
        nStatus = this.readNextByte() ?? 0;
        const statusCheck = nStatus & 0xf0;

        switch (statusCheck) {
          case EventNames.VoiceNoteOff:
            {
              nPreviousStatus = nStatus;
              const nChannel = nStatus & 0x0f;
              const nNoteId = this.readNextByte();
              const nVelocity = this.readNextByte();

              events.push(
                this.createMIDIEvent({
                  statusTimeDelta: nStatusTimeDelta,
                  eventType: EventNames.VoiceNoteOff,
                  channel: nChannel,
                  noteId: nNoteId!,
                  velocity: nVelocity!,
                })
              );
            }
            break;
          case EventNames.VoiceNoteOn:
            {
              nPreviousStatus = nStatus;
              const nChannel = nStatus & 0x0f;
              const nNoteId = this.readNextByte();
              const nVelocity = this.readNextByte();

              events.push(
                this.createMIDIEvent({
                  statusTimeDelta: nStatusTimeDelta,
                  eventType:
                    nVelocity === 0
                      ? EventNames.VoiceNoteOff
                      : EventNames.VoiceNoteOn,
                  channel: nChannel,
                  noteId: nNoteId!,
                  velocity: nVelocity!,
                })
              );
            }
            break;
          case EventNames.VoiceAftertouch:
            {
              const nChannel = nStatus & 0x0f;
              const nNoteId = this.readNextByte();
              const nValue = this.readNextByte();
              events.push(
                this.createMIDIEvent({
                  statusTimeDelta: nStatusTimeDelta,
                  eventType: EventNames.VoiceAftertouch,
                  channel: nChannel,
                  noteId: nNoteId,
                  value: nValue,
                })
              );
            }
            break;
          case EventNames.VoiceControlChange:
            {
              const nChannel = nStatus & 0x0f;
              const nControllerNumber = this.readNextByte();
              const nValue = this.readNextByte();
              events.push(
                this.createMIDIEvent({
                  statusTimeDelta: nStatusTimeDelta,
                  eventType: EventNames.VoiceControlChange,
                  channel: nChannel,
                  controller: nControllerNumber,
                  value: nValue,
                })
              );
            }
            break;
          case EventNames.VoiceProgramChange:
            {
              const nChannel = nStatus & 0x0f;
              const nProgramNumber = this.readNextByte();
              events.push(
                this.createMIDIEvent({
                  statusTimeDelta: nStatusTimeDelta,
                  eventType: EventNames.VoiceProgramChange,
                  channel: nChannel,
                  program: nProgramNumber,
                })
              );
            }
            break;
          case EventNames.VoiceChannelPressure:
            {
              const nChannel = nStatus & 0x0f;
              const nValue = this.readNextByte();
              events.push(
                this.createMIDIEvent({
                  statusTimeDelta: nStatusTimeDelta,
                  eventType: EventNames.VoiceChannelPressure,
                  channel: nChannel,
                  value: nValue,
                })
              );
            }
            break;
          case EventNames.VoicePitchBend:
            {
              const nChannel = nStatus & 0x0f;
              const nLSB = this.readNextByte();
              const nMSB = this.readNextByte();
              events.push(
                this.createMIDIEvent({
                  statusTimeDelta: nStatusTimeDelta,
                  eventType: EventNames.VoicePitchBend,
                  channel: nChannel,
                  pitchWheelLSB: nLSB,
                  pitchWheelMSB: nMSB,
                })
              );
            }
            break;
          case EventNames.SystemExclusive:
            {
              const nChannel = nStatus & 0x0f;
              events.push(
                this.createMIDIEvent({
                  statusTimeDelta: nStatusTimeDelta,
                  eventType: EventNames.SystemExclusive,
                  channel: nChannel,
                })
              );
            }
            break;
          default:
            {
              const nChannel = nStatus & 0x0f;
              events.push(
                this.createMIDIEvent({
                  statusTimeDelta: nStatusTimeDelta,
                  channel: nChannel,
                })
              );
            }
            break;
        }
      }
      track = {
        trackName: "test",
        instrument: "test",
        events: events,
        notes: this.interpretMidiEvent(events),
      };

      this.midiTracks?.push(track);
    }
  }

  private interpretMidiEvent(midiEvents: MIDIEvent[]): MIDINote[] {
    let nWallTime = 0;
    let notesBeingProcessed: MIDINote[] = [];
    let result: MIDINote[] = [];

    for (const event of midiEvents) {
      nWallTime += event.statusTimeDelta;
      if (event.eventType === EventNames.VoiceNoteOn) {
        notesBeingProcessed.push({
          key: event.noteId!,
          velocity: event.velocity!,
          startTime: nWallTime,
          duration: 0,
        });
      }

      if (event.eventType === EventNames.VoiceNoteOff) {
        const note = notesBeingProcessed.find((n) => event.noteId === n.key);
        if (note) {
          const index = notesBeingProcessed.indexOf(note);

          if (index > -1) {
            notesBeingProcessed.splice(index, 1);
          }

          note.duration = nWallTime - note?.startTime;
          result.push(note);
        }
      }
    }
    return result;
  }

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

  private createMIDIEvent(partialEvent: Partial<MIDIEvent>): MIDIEvent {
    return {
      statusTimeDelta: 0,
      eventType: undefined,
      channel: 0,
      noteId: null,
      velocity: null,
      controller: null,
      value: null,
      program: null,
      pitchWheelLSB: null,
      pitchWheelMSB: null,
      ...partialEvent,
    };
  }
}
