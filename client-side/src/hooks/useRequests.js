import { useContext } from "react";
import RequestsContext from "../context/RequestsContext";

function useRequests() {
  const context = useContext(RequestsContext);

  if (!context) {
    throw new Error(
      "useRequests must be used inside a RequestsProvider"
    );
  }

  return context;
}

export default useRequests;