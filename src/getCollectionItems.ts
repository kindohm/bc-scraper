import axios from "axios";

type CollectionItem = {
  sale_item_id: number;
  sale_item_type: string;
  item_title: string;
  band_name: string;
  updated: string;
  purchased: string;
};

type CollectionItemDate = CollectionItem & {
  realDate: Date;
};

export type CollectionItems = {
  redownload_urls: Record<string, string>;
  items: CollectionItemDate[];
};

export const getCollectionItems = async (
  fanId: number,
  limit: number,
  cookies: string,
  olderThanToken: string
): Promise<CollectionItems> => {
  const apiResponse = await axios.post(
    "https://bandcamp.com/api/fancollection/1/collection_items",
    {
      fan_id: fanId,
      older_than_token: olderThanToken,
      count: limit,
    },
    {
      headers: {
        Cookie: cookies,
        Accept: "application/json",
      },
    }
  );

  const newItems = apiResponse.data.items.map((item: CollectionItem) => {
    return {
      ...item,
      realDate: new Date(item.purchased),
    };
  });

  return { ...apiResponse.data, items: newItems };
};
