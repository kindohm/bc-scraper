import * as fs from "fs";

import { join } from "path";
import { directoryHasFiles } from "./util";
import { spawn } from "child_process";

const readDownloadDir = (downloadDirectory: string): Promise<string[]> => {
  return new Promise((res, rej) => {
    // console.log(downloadDirectory);
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
    const proc = spawn("unzip", [archivePath, "-d", destinationDirectory]);

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
) => {
  const zips = await readDownloadDir(downloadDirectory);

  for (let i = 0; i < zips.length; i++) {
    const filename = zips[i];

    const filePath = `${downloadDirectory}/${filename}`;
    const extractionDirectory = join(
      destinationDirectory,
      filename.replace(".zip", ""),
    );

    console.log("extracting", filename);

    const exists = await directoryHasFiles(extractionDirectory);

    if (exists) {
      console.log("already extracted", filename);
    } else {
      await extractFile(filePath, extractionDirectory);
    }
  }
};
