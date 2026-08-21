import { useState } from "react";
import { initialItems } from "../data/items";
import ItemsContext from "./ItemsContext";

function ItemsProvider({ children }) {
  const [items, setItems] = useState(initialItems);

  const addItem = (itemData) => {
    const newItem = {
      id: Date.now(),
      ...itemData,
      ownerId: 1,
      owner: "Wanja Juma",
      location: "Greenview Estate",
      availability: "Available",
      statusColor: "available",
    };

    setItems((currentItems) => [
      newItem,
      ...currentItems,
    ]);

    return newItem;
  };

  const value = {
    items,
    addItem,
  };

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
}

export default ItemsProvider;