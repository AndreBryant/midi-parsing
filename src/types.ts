import { EventNames } from "./enums/midiEnums";

export type MIDIEvent = {
  statusTimeDelta: number;
  eventType: EventNames | undefined;
  channel: number;
  noteId: number | null;
  velocity: number | null;
  controller: number | null;
  value: number | null;
  program: number | null;
  pitchWheelLSB: number | null;
  pitchWheelMSB: number | null;
};

export type MIDINote = {
  key: number;
  velocity: number;
  // channel: number;
  startTime: number;
  duration: number;
};

export type MIDITrack = {
  trackName: string;
  instrument: string;
  events: MIDIEvent[];
  notes: MIDINote[];
};
