import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { MIDIEventTypes } from "./enums/midiEnums.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFileAsync = promisify(fs.readFile);

export class MIDI {
  midiData: Buffer | null;

  constructor() {
    this.midiData = null;
  }

  async parseFile(filePath: string): Promise<void> {
    const absolutePath = path.resolve(__dirname, "../assets/midi", filePath);
    try {
      this.midiData = await readFileAsync(absolutePath);
      console.log("MIDI sataa stored successfully.");
    } catch (error) {
      console.error("Error reading FIle: ", error);
    }
  }

  getMidiData() {
    return this.midiData;
  }
}
