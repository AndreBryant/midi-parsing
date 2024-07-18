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

export enum MetaEvents {
  MetaSequence = 0x00,
  MetaText = 0x01,
  MetaCopyright = 0x02,
  MetaTrackName = 0x03,
  MetaInstrumentName = 0x04,
  MetaLyrics = 0x05,
  MetaMarker = 0x06,
  MetaCuePoint = 0x07,
  MetaChannelPrefix = 0x20,
  MetaEndOfTrack = 0x2f,
  MetaSetTempo = 0x51,
  MetaSMPTEOffset = 0x54,
  MetaTimeSignature = 0x58,
  MetaKeySignature = 0x59,
  MetaSequencerSpecific = 0x7f,
}
