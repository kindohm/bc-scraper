import { createWriteStream } from "fs";
import axios from "axios";

import { pathExists } from "./util";

export async function downloadFile(
  fileUrl: string,
  outputLocationPath: string,
  cookies: string,
) {
  const exists = await pathExists(outputLocationPath);
  if (exists) {
    console.log("skipping, already downloaded");
    return Promise.resolve(null);
  }

  return new Promise((resolve, rej) => {
    axios({
      method: "GET",
      url: fileUrl,
      responseType: "stream",
      headers: {
        Cookie: cookies,
      },
    })
      .then((res) => {
        if (res.status == 200) {
          // const path = require("path");
          // const SUB_FOLDER = SUB_FOLDER || "";
          // fileName = fileName || reqUrl.split("/").pop();

          // const dir = path.resolve(__dirname, SUB_FOLDER, fileName);
          res.data.pipe(createWriteStream(outputLocationPath));
          res.data.on("chunk", (x: any) => {
            console.log("chunk", x);
          });

          res.data.on("end", () => {
            console.log("download completed");
            return resolve(null);
          });
        } else {
          console.log(`ERROR >> ${res.status}`);
          return rej(new Error(res.statusText));
        }
      })
      .catch((err) => {
        console.log("Error ", err);
        rej(err);
      });
  });
}
