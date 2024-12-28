import * as fs from "fs";

export const readCookies = (cookiesPath: string): Promise<string> => {
  return new Promise((res, rej) => {
    fs.readFile(cookiesPath, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        return rej(err);
      }

      const lines = data.split("\n");
      const cookies = lines.reduce((acc, cur: string, index: number) => {
        if (index < 4) {
          return acc;
        }

        const parts = cur.split("\t");
        const key = parts[parts.length - 2];

        if (!key) {
          return acc;
        }

        const val = parts[parts.length - 1];

        if (val.length > 200) {
          return acc;
        }

        return `${acc} ${key}=${val};`; // { ...acc, [key]: val };
      }, "");
      res(cookies);
      // const cookiesString = res(cookies);
    });
  });
};
