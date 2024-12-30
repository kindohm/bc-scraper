import * as fs from "fs";

import { join } from "path";
import { directoryHasFiles } from "./util";
import { spawn } from "child_process";

const readDownloadDir = (downloadDirectory: string): Promise<string[]> => {
  return new Promise((res, rej) => {
    fs.readdir(downloadDirectory, (err, data) => {
      if (err) {
        return rej(err);
      }
      res(data.filter((d) => d.endsWith(".zip")));
    });
  });
};

const extractFile = (archivePath: string, destinationDirectory: string) => {
  return new Promise((res, rej) => {
    const proc = spawn("unzip", [
      "-o",
      archivePath,
      "-d",
      destinationDirectory,
    ]);

    proc.on("close", () => {
      res(null);
    });

    proc.on("error", (e) => {
      rej(e);
    });
  });
};

export const extractItems = async (
  downloadDirectory: string,
  destinationDirectory: string,
  reextract: boolean
) => {
  const zips = await readDownloadDir(downloadDirectory);

  for (let i = 0; i < zips.length; i++) {
    const filename = zips[i];

    const filePath = `${downloadDirectory}/${filename}`;
    const extractionDirectory = join(
      destinationDirectory,
      filename.replace(".zip", "")
    );

    console.log("extracting", filename);

    const exists = await directoryHasFiles(extractionDirectory);

    if (!exists || reextract) {
      await extractFile(filePath, extractionDirectory);
    } else {
      console.log("already extracted", filename);
    }
  }
};
