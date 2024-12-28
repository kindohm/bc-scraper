import { readdir, unlink } from "fs";
import { join } from "path";

export const cleanDirectory = (directory: string): Promise<void> => {
  return new Promise((res, rej) => {
    readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        unlink(join(directory, file), (err) => {
          if (err) throw err;
        });
      }

      res();
    });
  });
};
