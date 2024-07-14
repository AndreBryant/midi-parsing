export enum MIDIEventTypes {
  NoteOn = "NoteOn",
  NoteOff = "NoteOff",
  Other = "other event",
}

export enum EventNames {
  VoiceNoteOff = 0x80,
  VoiceNoteOn = 0x90,
  VoiceAftertouch = 0xa0,
  VoiceControlChange = 0xb0,
  VoiceProgramChange = 0xc0,
  VoiceChannelPressure = 0xd0,
  VoicePitchBend = 0xe0,
  SystemExclusive = 0xf0,
}
