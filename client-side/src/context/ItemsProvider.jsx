import {
  useCallback,
  useEffect,
  useMemo,
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
    let cancelled = false;

    const loadItems =
      async () => {
        try {
          const data =
            await getItems();

          if (!cancelled) {
            setItems(
              Array.isArray(data)
                ? data
                : []
            );

            setItemsError("");
          }
        } catch (error) {
          if (!cancelled) {
            setItemsError(
              error.message ||
                "Failed to load items."
            );
          }
        } finally {
          if (!cancelled) {
            setItemsLoading(false);
          }
        }
      };

    loadItems();

    return () => {
      cancelled = true;
    };
  }, []);


  const addItem =
    useCallback(
      async (itemData) => {
        try {
          setItemsError("");

          const savedItem =
            await createItem(
              itemData
            );

          setItems(
            (currentItems) => [
              savedItem,
              ...currentItems,
            ]
          );

          return savedItem;
        } catch (error) {
          setItemsError(
            error.message ||
              "Failed to add item."
          );

          throw error;
        }
      },
      []
    );


  const updateItem =
    useCallback(
      async (
        itemId,
        updates
      ) => {
        try {
          setItemsError("");

          const updatedItem =
            await updateItemRequest(
              itemId,
              updates
            );

          setItems(
            (currentItems) =>
              currentItems.map(
                (item) => {
                  if (
                    String(
                      item.id
                    ) !==
                    String(
                      itemId
                    )
                  ) {
                    return item;
                  }

                  return {
                    ...item,
                    ...updates,
                    ...updatedItem,
                  };
                }
              )
          );

          return updatedItem;
        } catch (error) {
          setItemsError(
            error.message ||
              "Failed to update item."
          );

          throw error;
        }
      },
      []
    );


  const deleteItem =
    useCallback(
      async (itemId) => {
        try {
          setItemsError("");

          await deleteItemRequest(
            itemId
          );

          setItems(
            (currentItems) =>
              currentItems.filter(
                (item) =>
                  String(
                    item.id
                  ) !==
                  String(
                    itemId
                  )
              )
          );
        } catch (error) {
          setItemsError(
            error.message ||
              "Failed to delete item."
          );

          throw error;
        }
      },
      []
    );


  const value =
    useMemo(
      () => ({
        items,
        itemsLoading,
        itemsError,
        addItem,
        updateItem,
        deleteItem,
        refreshItems,
      }),
      [
        items,
        itemsLoading,
        itemsError,
        addItem,
        updateItem,
        deleteItem,
        refreshItems,
      ]
    );


  return (
    <ItemsContext.Provider
      value={value}
    >
      {children}
    </ItemsContext.Provider>
  );
}


export default ItemsProvider;