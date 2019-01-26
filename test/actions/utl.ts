import * as fs from "fs";
import * as path from "path";

export function resetOutputDir() {
  fs.readdirSync(`${path.join(__dirname, "output")}`)
    .filter(pFileName => pFileName.endsWith(".json"))
    .forEach(pFileName => {
      try {
        fs.unlinkSync(path.join(__dirname, "output", pFileName));
      } catch (e) {
        // probably files didn't exist in the first place
        // so ignore the exception
      }
    });
}
