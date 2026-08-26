import { useContext } from "react";
import ItemsContext from "../context/ItemsContext";

function useItems() {
  const context = useContext(ItemsContext);

  if (!context) {
    throw new Error(
      "useItems must be used inside an ItemsProvider"
    );
  }

  return context;
}

export default useItems;