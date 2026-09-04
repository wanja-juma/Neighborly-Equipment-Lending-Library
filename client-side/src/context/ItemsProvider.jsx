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
import useAuth from "../hooks/useAuth";

export default function ItemsProvider({ children }) {
  const { currentUser } = useAuth();

  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");

  const refreshItems = useCallback(async () => {
    try {
      setItemsLoading(true);
      setItemsError("");

      const data = await getItems();

      const normalizedItems = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : [];

      setItems(normalizedItems);
      return normalizedItems;
    } catch (error) {
      const message = error.message || "Failed to load items.";
      setItemsError(message);
      throw error;
    } finally {
      setItemsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadItems = async () => {
      try {
        const data = await getItems();

        if (cancelled) {
          return;
        }

        setItems(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.items)
              ? data.items
              : []
        );

        setItemsError("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setItemsError(
          error.message || "Failed to load items."
        );
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

  const addItem = useCallback(
    async (itemData) => {
      try {
        setItemsError("");

        const newItemData = {
          ...itemData,
          ownerId: currentUser ? Number(currentUser.id) : undefined,
          owner: currentUser?.name,
          location: currentUser?.community || currentUser?.location,
          availability: "Available",
          statusColor: "available",
        };

        const savedItem = await createItem(newItemData);

        setItems((currentItems) => [
          savedItem,
          ...currentItems,
        ]);

        return savedItem;
      } catch (error) {
        setItemsError(
          error.message || "Failed to add item."
        );
        throw error;
      }
    },
    [currentUser]
  );

  const updateItem = useCallback(
    async (itemId, updates) => {
      try {
        setItemsError("");

        const updatedItem = await updateItemRequest(
          itemId,
          updates
        );

        setItems((currentItems) =>
          currentItems.map((item) => {
            if (String(item.id) !== String(itemId)) {
              return item;
            }

            return {
              ...item,
              ...updates,
              ...updatedItem,
            };
          })
        );

        return updatedItem;
      } catch (error) {
        setItemsError(
          error.message || "Failed to update item."
        );
        throw error;
      }
    },
    []
  );

  const deleteItem = useCallback(
    async (itemId) => {
      try {
        setItemsError("");

        await deleteItemRequest(itemId);

        setItems((currentItems) =>
          currentItems.filter(
            (item) => String(item.id) !== String(itemId)
          )
        );
      } catch (error) {
        setItemsError(
          error.message || "Failed to delete item."
        );
        throw error;
      }
    },
    []
  );

  const value = useMemo(
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
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
}