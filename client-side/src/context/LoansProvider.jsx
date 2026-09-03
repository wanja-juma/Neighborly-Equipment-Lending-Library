import { useEffect, useState } from "react";
import {
  createLoan,
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

  const addLoan = async (loanData) => {
  const existingLoan = loans.find(
    (loan) =>
      loanData.requestId &&
      String(loan.requestId) ===
        String(loanData.requestId)
  );

  if (existingLoan) {
    return {
      success: false,
      message:
        "A loan already exists for this request.",
    };
  }

  try {
    const newLoanData = {
      ...loanData,
      status: loanData.status || "On Track",
      createdAt: new Date().toISOString(),
      returnedAt: null,
    };

    const savedLoan = await createLoan(
      newLoanData
    );

    setLoans((currentLoans) => [
      savedLoan,
      ...currentLoans,
    ]);

    return {
      success: true,
      loan: savedLoan,
      message: "Loan created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.message ||
        "Failed to create the loan.",
    };
  }
};

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
            newStatus === "returned"
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
  addLoan,
  updateLoanStatus,
};

  return (
    <LoansContext.Provider value={value}>
      {children}
    </LoansContext.Provider>
  );
}

export default LoansProvider;