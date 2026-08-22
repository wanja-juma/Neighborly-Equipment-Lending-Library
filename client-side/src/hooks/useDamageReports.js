import { useContext } from "react";
import DamageReportsContext from "../context/DamageReportsContext.js";

function useDamageReports() {
  const context = useContext(
    DamageReportsContext
  );

  if (!context) {
    throw new Error(
      "useDamageReports must be used inside DamageReportsProvider."
    );
  }

  return context;
}

export default useDamageReports;