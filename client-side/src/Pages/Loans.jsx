import { useState } from "react";
import useLoans from "../hooks/useLoans";
import useItems from "../hooks/useItems";
import getLoanStatus from "../utils/getLoanStatus";
import "./BrowseItems.css";

const CURRENT_USER_ID = "1";

function Loans() {
  const {
    loans = [],
    loansLoading,
    loansError,
    updateLoanStatus,
  } = useLoans();

  const { updateItem } = useItems();

  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [updatingLoanId, setUpdatingLoanId] = useState(null);

  const borrowedLoans = loans.filter(
    (loan) => String(loan.borrowerId) === CURRENT_USER_ID
  );

  const lentLoans = loans.filter(
    (loan) => String(loan.ownerId) === CURRENT_USER_ID
  );

  const getStatusClass = (status) => {
    return (status || "On Track")
      .toLowerCase()
      .replaceAll(" ", "-");
  };

  const getItemId = (loan) => loan?.itemId || loan?.item_id;

  const handleMarkReturned = async (loanId) => {
    setNotice("");
    setActionError("");
    setUpdatingLoanId(loanId);

    const selectedLoan = loans.find(
      (loan) => String(loan.id) === String(loanId)
    );

    if (!selectedLoan) {
      setActionError("The selected loan could not be found.");
      setUpdatingLoanId(null);
      return;
    }

    try {
      const loanResult = await updateLoanStatus(loanId, "Returned");

      if (loanResult && loanResult.success === false) {
        throw new Error(
          loanResult.message || "The loan could not be updated."
        );
      }

      const itemId = getItemId(selectedLoan);

      if (!itemId) {
        setNotice("The loan was marked as returned.");
        return;
      }

      await updateItem(itemId, {
        availability: "Available",
      });

      setNotice(
        "Loan marked as returned and the item is available again."
      );
    } catch (error) {
      setActionError(
        error.message || "The loan could not be marked as returned."
      );
    } finally {
      setUpdatingLoanId(null);
    }
  };

  const renderLoanCard = (loan, type) => {
    const currentStatus = getLoanStatus(loan);
    const isReturned = currentStatus === "Returned";
    const isUpdating = String(updatingLoanId) === String(loan.id);

    return (
      <article className="loan-page-card" key={loan.id}>
        <div className="loan-page-card-top">
          <div className="loan-page-item">
            <span className="loan-page-icon">{loan.icon || "🧰"}</span>

            <div>
              <span className="loan-type-label">
                {type === "borrowed" ? "BORROWED ITEM" : "LENT ITEM"}
              </span>

              <h3>
                {loan.item || loan.itemName || "Equipment"}
              </h3>
            </div>
          </div>

          <span
            className={`loan-page-status ${getStatusClass(
              currentStatus
            )}`}
          >
            {currentStatus}
          </span>
        </div>

        <div className="loan-page-details">
          <p>
            <strong>
              {type === "borrowed" ? "Borrowed from:" : "Lent to:"}
            </strong>{" "}
            {loan.person ||
              (type === "borrowed"
                ? loan.ownerName
                : loan.borrowerName) ||
              "Neighbour"}
          </p>

          <p>
            <strong>Due date:</strong>{" "}
            {loan.dueDate || loan.due_date || "Not provided"}
          </p>

          {(loan.returnedAt || loan.returned_at) && (
            <p>
              <strong>Returned:</strong>{" "}
              {new Date(
                loan.returnedAt || loan.returned_at
              ).toLocaleDateString()}
            </p>
          )}
        </div>

        {!isReturned && (
          <div className="loan-page-actions">
            <button
              className="return-item-button"
              type="button"
              disabled={isUpdating}
              onClick={() => handleMarkReturned(loan.id)}
            >
              {isUpdating ? "Updating..." : "Mark as Returned"}
            </button>
          </div>
        )}
      </article>
    );
  };

  if (loansLoading) {
    return (
      <main className="dashboard-main">
        <section className="page-content">
          <p>Loading loans...</p>
        </section>
      </main>
    );
  }

  if (loansError) {
    return (
      <main className="dashboard-main">
        <section className="page-content">
          <p>{loansError}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-main">
      <section className="page-content loans-page">
        <header className="loans-page-header">
          <div>
            <p className="page-label">LOAN MANAGEMENT</p>
            <h1>Active Loans</h1>
            <p>
              View borrowed, lent, returned and overdue items.
            </p>
          </div>

          <div className="loans-page-summary">
            <div>
              <strong>{borrowedLoans.length}</strong>
              <span>Borrowed</span>
            </div>

            <div>
              <strong>{lentLoans.length}</strong>
              <span>Lent Out</span>
            </div>
          </div>
        </header>

        {notice && (
          <p className="loan-action-notice success" role="status">
            {notice}
          </p>
        )}

        {actionError && (
          <p className="loan-action-notice error" role="alert">
            {actionError}
          </p>
        )}

        <section className="loan-page-section">
          <div className="loan-section-heading">
            <div>
              <h2>Items I Borrowed</h2>
              <p>Equipment you borrowed from your neighbours.</p>
            </div>
            <span>{borrowedLoans.length}</span>
          </div>

          <div className="loan-page-grid">
            {borrowedLoans.length > 0 ? (
              borrowedLoans.map((loan) =>
                renderLoanCard(loan, "borrowed")
              )
            ) : (
              <div className="loan-page-empty">
                <p>You have not borrowed any items.</p>
              </div>
            )}
          </div>
        </section>

        <section className="loan-page-section">
          <div className="loan-section-heading">
            <div>
              <h2>Items I Lent Out</h2>
              <p>Equipment currently borrowed from you.</p>
            </div>
            <span>{lentLoans.length}</span>
          </div>

          <div className="loan-page-grid">
            {lentLoans.length > 0 ? (
              lentLoans.map((loan) => renderLoanCard(loan, "lent"))
            ) : (
              <div className="loan-page-empty">
                <p>You have not lent out any items.</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Loans;