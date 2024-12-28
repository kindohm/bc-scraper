import * as fs from "fs";

export const pathExists = (filePath: string): Promise<boolean> => {
  return new Promise((res, rej) => {
    fs.access(filePath, (err) => {
      if (err) {
        return res(false);
      }
      return res(true);
    });
  });
};

export const directoryHasFiles = (directoryPath: string): Promise<boolean> => {
  return new Promise((res, rej) => {
    fs.readdir(directoryPath, (err, result) => {
      if (err) {
        return res(false);
      }

      return res(result.length > 0);
    });
  });
};

export const ensureDirectory = (directory: string): Promise<string> => {
  return new Promise((res, rej) => {
    fs.access(directory, (err) => {
      if (!err) {
        return res(directory);
      }

      fs.mkdir(directory, { recursive: true }, (err) => {
        if (!err) {
          return res(directory);
        }
        rej(err);
      });
    });
  });
};

export const sanitizeString = (input: string) => {
  let clean = input
    .replace(/[^0-9a-z-A-Z]/g, "-")
    .replace(/---/g, "-")
    .replace(/--/g, "-");

  if (clean.endsWith("-")) {
    clean = clean.substring(0, clean.length - 2);
  }

  if (clean.startsWith("-")) {
    clean = clean.substring(1);
  }
  return clean;
};
