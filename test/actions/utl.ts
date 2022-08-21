import { readdirSync, unlinkSync } from "fs";
import { join } from "path";

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
