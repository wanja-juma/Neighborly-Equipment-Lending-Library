import { useEffect, useState } from "react";
import {
  createItem,
  deleteItem as deleteItemRequest,
  getItems,
  updateItem as updateItemRequest,
} from "../services/api";
import ItemsContext from "./ItemsContext";
import useAuth from "../hooks/useAuth";

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
    const newItemData = {
      ...itemData,
      ownerId: Number(currentUser?.id),
      owner: currentUser?.name || "Neighbour",
      location: "Greenview Estate",
      availability: "Available",
      statusColor: "available",
    };

    const savedItem = await createItem(
      newItemData
    );

    setItems((currentItems) => [
      savedItem,
      ...currentItems,
    ]);

    return savedItem;
  };

  const updateItem = async (
    itemId,
    updates
  ) => {
    const updatedItem = await updateItemRequest(
      itemId,
      updates
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