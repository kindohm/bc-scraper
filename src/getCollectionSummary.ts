import axios from "axios";

const COLLECTION_SUMMARY_API =
  "https://bandcamp.com/api/fan/2/collection_summary";

// "item_type": "a",
// "item_id": 964967358,
// "band_id": 1533096991,
// "purchased": "07 Dec 2024 15:03:05 GMT"

type CollectionSummaryItem = {
  item_type: string;
  item_id: number;
  band_id: number;
  purchased: string;
};

export type CollectionSummary = {
  fan_id: number;
  collection_summary: {
    tralbum_lookup: Record<string, CollectionSummaryItem>;
  };
};

export const getCollectionSummary = async (
  cookies: string,
): Promise<CollectionSummary> => {
  const summaryResponse = await axios.get(COLLECTION_SUMMARY_API, {
    headers: {
      Cookie: cookies,
      Accept: "application/json",
    },
  });

  return summaryResponse.data;
};
