import { readCookies } from "./readCookies";
import { getCollectionSummary } from "./getCollectionSummary";
import { getCollectionItems } from "./getCollectionItems";
import { downloadItems } from "./downloadItems";
import { extractItems } from "./extract";
import { add } from "date-fns";
import { getOlderThanToken } from "./getOlderThanToken";
import { ensureDirectory } from "./util";

const QUERY_LIMIT = 2;
const DAYS_TO_PROCESS = 60;
const COOKIES_PATH = "/Users/kindohm/Downloads/cookies.txt";

const oldestDate = add(new Date(), { days: -DAYS_TO_PROCESS });

import yargs from "yargs";
import path from "path";

const main = async () => {
  try {
    const argv = await yargs(process.argv.slice(2))
      .usage("Usage: $0 --downloadDir [string] --extractDir [string]")
      .options({
        downloadDir: {
          type: "string",
          default: path.join(__dirname, "files", "downloaded"),
        },
        extractDir: {
          type: "string",
          default: path.join(__dirname, "files", "extracted"),
        },
      })
      .parse();

    console.log(
      "ensuring download directory",
      await ensureDirectory(argv.downloadDir),
    );
    console.log(
      "ensuring extraction directory",
      await ensureDirectory(argv.extractDir),
    );

    const cookies = await readCookies(COOKIES_PATH);
    const summary = await getCollectionSummary(cookies);

    const collectionItems = await getCollectionItems(
      summary.fan_id,
      QUERY_LIMIT,
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
    await downloadItems(filteredCollectionItems, argv.downloadDir, cookies);

    console.log("extracting archives...");
    await extractItems(argv.downloadDir, argv.extractDir);

    console.log("done");
    return;
  } catch (err) {
    console.error("error!", err);
  }
};

main();
