import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MIDI {
  constructor() {}

  parseFile(filePath: string) {
    const absolutePath = path.resolve(__dirname, "../assets/midi", filePath);

    fs.readFile(absolutePath, (error, fileContents) => {
      if (error) {
        console.error("Error Reading FIle: ", error);
        return;
      }
      // console.log(fileContents);
      console.log(fileContents.toString("hex"));
    });
  }
}
