import { readCookies } from "./readCookies";
import { getCollectionSummary } from "./getCollectionSummary";
import { getCollectionItems } from "./getCollectionItems";
import { downloadItems } from "./downloadItems";
import { extractItems } from "./extract";
import { add } from "date-fns";
import { getOlderThanToken } from "./getOlderThanToken";
import { ensureDirectory } from "./util";
import { homedir } from "os";

import yargs from "yargs";
import path from "path";

const main = async () => {
  try {
    const argv = await yargs(process.argv.slice(2))
      .options({
        redownload: {
          type: "boolean",
          default: false,
        },
        reextract: {
          type: "boolean",
          default: false,
        },
        queryLimit: {
          type: "number",
          default: 5,
        },
        days: { type: "number", default: 30 },
        downloadDir: {
          type: "string",
          default: path.join(homedir(), "bc-files", "downloaded"),
        },
        extractDir: {
          type: "string",
          default: path.join(homedir(), "bc-files", "extracted"),
        },
        cookies: {
          type: "string",
          default: path.join(homedir(), "Downloads", "cookies.txt"),
        },
      })
      .parse();

    const oldestDate = add(new Date(), { days: -argv.days });

    console.log("oldest date", oldestDate);

    console.log(
      "ensuring download directory",
      await ensureDirectory(argv.downloadDir),
    );
    console.log(
      "ensuring extraction directory",
      await ensureDirectory(argv.extractDir),
    );

    const cookies = await readCookies(argv.cookies);
    const summary = await getCollectionSummary(cookies);

    const collectionItems = await getCollectionItems(
      summary.fan_id,
      argv.queryLimit,
      cookies,
      getOlderThanToken(summary),
    );

    const recentItems = collectionItems.items.filter((item) => {
      return item.realDate >= oldestDate;
    });

    const filteredCollectionItems = { ...collectionItems, items: recentItems };

    console.log("query count", collectionItems.items.length);
    console.log("recent count", filteredCollectionItems.items.length);

    console.log("downloading music...");
    await downloadItems(
      filteredCollectionItems,
      argv.downloadDir,
      cookies,
      argv.redownload,
    );

    console.log("extracting archives...");
    await extractItems(argv.downloadDir, argv.extractDir, argv.reextract);

    console.log("done");
    return;
  } catch (err) {
    console.error("error!", err);
  }
};

main();
