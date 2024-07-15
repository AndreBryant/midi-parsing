import { EventNames } from "./enums/midiEnums";

export type uint8 = number;
export type uint16 = number;
export type uint32 = number;

export type int8 = number;
export type int16 = number;
export type int32 = number;

function toUint8(num: number): uint8 {
  return num & 255;
}

function toUint16(num: number): uint16 {
  return num & 65535;
}

function toUint32(num: number): uint32 {
  return (num | 0) >= 0 ? num | 0 : (num | 0) + 4294967296;
}

function toInt8(num: number): int8 {
  return (num & 255) < 128 ? num & 255 : (num & 255) - 256;
}

function toInt16(num: number): int16 {
  return (num & 65535) < 32768 ? num & 65535 : (num & 65535) - 65536;
}

function toInt32(num: number): int32 {
  return num | 0;
}

export type MIDIEvent = {
  statusTimeDelta: number;
  eventType: EventNames;
  channel: number;
  noteId: number;
  velocity: number;
};

export type MIDINote = {
  key: number;
  velocity: number;
  channel: number;
  startTime: number;
  duration: number;
};

export type MIDITrack = {
  trackName: string;
  instrument: string;
  events: MIDIEvent[];
  notes: MIDINote[];
};
