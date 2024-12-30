import axios from "axios";

const COLLECTION_SUMMARY_API =
  "https://bandcamp.com/api/fan/2/collection_summary";

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
