import { readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";

export function resetOutputDir(pDirName = "output") {
  return () => {
    readdirSync(`${join(__dirname, pDirName)}`)
      .filter((pFileName) => pFileName.endsWith(".json"))
      .forEach((pFileName) => {
        try {
          unlinkSync(join(__dirname, pDirName, pFileName));
        } catch (pError: any) {
          // probably files didn't exist in the first place
          // so ignore the exception
        }
      });
  };
}
