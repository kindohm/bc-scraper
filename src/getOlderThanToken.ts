import { CollectionSummary } from "./getCollectionSummary";

export const getOlderThanToken = (summary: CollectionSummary) => {
  const albumKeys = Object.keys(summary.collection_summary.tralbum_lookup);
  const firstKey = albumKeys[0];
  const { item_type, item_id } =
    summary.collection_summary.tralbum_lookup[firstKey];
  const now = new Date();
  const olderThanToken = `${now.getTime()}:${item_id}:${item_type}::`;
  return olderThanToken;
};
