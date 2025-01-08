import axios from "axios";
import { JSDOM } from "jsdom";
import { CollectionItems } from "./getCollectionItems";
import { spawn } from "child_process";
import path from "path";
import { pathExists, sanitizeString } from "./util";

const downloadFile = (
  url: string,
  downloadFilePath: string,
  cookies: string,
  log: (msg: string) => void
) => {
  return new Promise((res, rej) => {
    const proc = spawn("curl", [
      "-o",
      downloadFilePath,
      "--header",
      `Cookie: ${cookies}`,
      url,
    ]);

    proc.on("close", () => {
      res(null);
    });

    proc.on("error", (e) => {
      rej(e);
    });
  });
};

export const downloadItems = async (
  items: CollectionItems,
  destinationDirectory: string,
  cookies: string,
  redownload: boolean
) => {
  console.log("downloading", items.items.length, "items");
  for (let i = 0; i < items.items.length; i++) {
    const item = items.items[i];

    const redownloadUrl =
      items.redownload_urls[`${item.sale_item_type}${item.sale_item_id}`];

    const downloadDocResponse = await axios.get(redownloadUrl, {
      headers: { Cookie: cookies },
    });

    const doc = new JSDOM(downloadDocResponse.data);
    const pageDataDiv = doc.window.document.querySelector("#pagedata");
    const dataBlob = pageDataDiv?.attributes.getNamedItem("data-blob")?.value;
    if (!dataBlob) {
      console.warn("no data blob");
      return;
    }
    const data = JSON.parse(dataBlob);
    const format = "mp3-320";

    if (!data.download_items[0].downloads) {
      console.warn("no downloads", item.band_name, item.item_title);
      continue;
    }

    const url = data.download_items[0]?.downloads[format]?.url;

    if (!url) {
      console.warn("no mp3-320 format", item.band_name, item.item_title);
      continue;
    }

    const artist = data.download_items[0].artist;
    const isTrack = data.download_items[0].item_type === "t";
    const slug = data.download_items[0].url_hints.slug;

    const extension = isTrack ? "mp3" : "zip";
    const sanitizedArtist = sanitizeString(artist);

    const filename = `${sanitizedArtist}.${slug}.${extension}`;
    const downloadFilePath = path.join(destinationDirectory, filename);

    console.log(
      `downloading ${i + 1} of ${items.items.length} (${(((i + 1) / items.items.length) * 100).toFixed(0)}%)`,
      filename
    );

    const exists = await pathExists(downloadFilePath);

    if (!exists || redownload) {
      await downloadFile(url, downloadFilePath, cookies, process.stdout.write);
    } else {
      console.log("already downloaded");
    }
  }
};
