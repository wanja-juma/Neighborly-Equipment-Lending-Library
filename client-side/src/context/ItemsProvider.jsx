import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  createItem,
  deleteItem as deleteItemRequest,
  getItems,
  updateItem as updateItemRequest,
} from "../services/api";

import ItemsContext from "./ItemsContext";


function ItemsProvider({
  children,
}) {
  const [
    items,
    setItems,
  ] = useState([]);

  const [
    itemsLoading,
    setItemsLoading,
  ] = useState(true);

  const [
    itemsError,
    setItemsError,
  ] = useState("");


  const refreshItems =
    useCallback(async () => {
      try {
        setItemsLoading(true);
        setItemsError("");

        const data =
          await getItems();

        setItems(
          Array.isArray(data)
            ? data
            : []
        );

        return data;
      } catch (error) {
        setItemsError(
          error.message ||
            "Failed to load items."
        );

        throw error;
      } finally {
        setItemsLoading(false);
      }
    }, []);


  useEffect(() => {
    refreshItems();
  }, [refreshItems]);


  const addItem =
    async (itemData) => {
      const newItemData = {
        ...itemData,

        location:
          itemData.location ||
          "Greenview Estate",

        availability:
          itemData.availability ||
          "Available",

        statusColor:
          itemData.statusColor ||
          "available",
      };


      const savedItem =
        await createItem(
          newItemData
        );


      setItems(
        (currentItems) => [
          savedItem,
          ...currentItems,
        ]
      );


      return savedItem;
    };


  const updateItem =
    async (
      itemId,
      updates
    ) => {
      const response =
        await updateItemRequest(
          itemId,
          updates
        );


      /*
       * Merge the submitted changes
       * into the existing item.
       *
       * This makes the UI update
       * immediately even if Flask
       * only returns part of the item.
       */
      setItems(
        (currentItems) =>
          currentItems.map(
            (item) => {
              if (
                String(item.id) !==
                String(itemId)
              ) {
                return item;
              }


              return {
                ...item,
                ...updates,
                ...(response &&
                typeof response ===
                  "object"
                  ? response
                  : {}),
              };
            }
          )
      );


      return response;
    };


  const deleteItem =
    async (itemId) => {
      await deleteItemRequest(
        itemId
      );


      setItems(
        (currentItems) =>
          currentItems.filter(
            (item) =>
              String(item.id) !==
              String(itemId)
          )
      );
    };


  const value = {
    items,
    itemsLoading,
    itemsError,

    addItem,
    updateItem,
    deleteItem,
    refreshItems,
  };


  return (
    <ItemsContext.Provider
      value={value}
    >
      {children}
    </ItemsContext.Provider>
  );
}


export default ItemsProvider;