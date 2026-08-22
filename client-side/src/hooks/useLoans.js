import { useContext } from "react";
import LoansContext from "../context/LoansContext";

function useLoans() {
  const context = useContext(LoansContext);

  if (!context) {
    throw new Error(
      "useLoans must be used inside LoansProvider."
    );
  }

  return context;
}

export default useLoans;