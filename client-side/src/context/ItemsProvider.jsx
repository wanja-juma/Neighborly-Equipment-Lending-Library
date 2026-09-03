import { useEffect, useState } from "react";
import {
  createItem,
  deleteItem as deleteItemRequest,
  getItems,
  updateItem as updateItemRequest,
} from "../services/api";
import useAuth from "../hooks/useAuth";
import ItemsContext from "./ItemsContext";

// The backend expects categoryId/status; older parts of the UI still
// collect them as category/availability. Translate here, in one place,
// so every caller (AddItem, EditItem, ChangeAvailability...) can keep
// using the field names they already have.
const toBackendFields = (data) => {
  const backendData = { ...data };

  if ("category" in backendData) {
    backendData.categoryId = backendData.category;
    delete backendData.category;
  }

  if ("availability" in backendData) {
    backendData.status = backendData.availability;
    delete backendData.availability;
  }

  return backendData;
};

function ItemsProvider({ children }) {
  const { currentUser } = useAuth();

  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] =
    useState(true);

  const [itemsError, setItemsError] =
    useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        setItemsLoading(true);
        setItemsError("");

        const data = await getItems();

        setItems(data);
      } catch (error) {
        setItemsError(
          error.message || "Failed to load items."
        );
      } finally {
        setItemsLoading(false);
      }
    };

    loadItems();
  }, []);

  const addItem = async (itemData) => {
    if (!currentUser?.id) {
      throw new Error("You must be logged in to add an item.");
    }

    const savedItem = await createItem(
      toBackendFields({
        ...itemData,
        ownerId: Number(currentUser.id),
      })
    );

    setItems((currentItems) => [
      savedItem,
      ...currentItems.filter(
        (item) =>
          String(item.id) !== String(savedItem.id)
      ),
    ]);

    return savedItem;
  };

  const updateItem = async (
    itemId,
    updates
  ) => {
    const updatedItem = await updateItemRequest(
      itemId,
      toBackendFields(updates)
    );

    setItems((currentItems) =>
      currentItems.map((item) =>
        String(item.id) === String(itemId) ? updatedItem : item
      )
    );

    return updatedItem;
  };

 const deleteItem = async (itemId) => {
  await deleteItemRequest(itemId);

  setItems((currentItems) =>
    currentItems.filter(
      (item) =>
        String(item.id) !== String(itemId)
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
  };

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
}

export default ItemsProvider;
