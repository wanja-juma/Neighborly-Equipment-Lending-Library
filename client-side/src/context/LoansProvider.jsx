import { useEffect, useState } from "react";
import {
  getLoans,
  updateLoan,
} from "../services/api";
import LoansContext from "./LoansContext";

function LoansProvider({ children }) {
  const [loans, setLoans] = useState([]);
  const [loansLoading, setLoansLoading] =
    useState(true);
  const [loansError, setLoansError] =
    useState("");

  useEffect(() => {
    const loadLoans = async () => {
      try {
        setLoansLoading(true);
        setLoansError("");

        const data = await getLoans();

        setLoans(data);
      } catch (error) {
        setLoansError(
          error.message || "Failed to load loans."
        );
      } finally {
        setLoansLoading(false);
      }
    };

    loadLoans();
  }, []);

  const updateLoanStatus = async (
    loanId,
    newStatus
  ) => {
    try {
      const updatedLoan = await updateLoan(
        loanId,
        {
          status: newStatus,
          returnedAt:
            newStatus === "Returned"
              ? new Date().toISOString()
              : null,
        }
      );

      setLoans((currentLoans) =>
        currentLoans.map((loan) =>
          String(loan.id) === String(loanId)
            ? updatedLoan
            : loan
        )
      );

      return {
        success: true,
        loan: updatedLoan,
        message: `Loan marked as ${newStatus.toLowerCase()}.`,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message ||
          "Failed to update the loan.",
      };
    }
  };

  const value = {
    loans,
    loansLoading,
    loansError,
    updateLoanStatus,
  };

  return (
    <LoansContext.Provider value={value}>
      {children}
    </LoansContext.Provider>
  );
}

export default LoansProvider;