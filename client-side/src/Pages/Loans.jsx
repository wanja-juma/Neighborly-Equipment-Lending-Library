import {
  useMemo,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";
import useItems from "../hooks/useItems";
import useLoans from "../hooks/useLoans";
import getLoanStatus from "../utils/getLoanStatus";
import "./Loans.css";

function Loans() {
  const { currentUser } = useAuth();

  const {
    loans,
    loansLoading,
    loansError,
    updateLoanStatus,
  } = useLoans();

  const { updateItem } = useItems();

  const [activeTab, setActiveTab] =
    useState("borrowed");

  const [notice, setNotice] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  const [
    updatingLoanId,
    setUpdatingLoanId,
  ] = useState(null);

  const currentUserId = String(
    currentUser?.id || "1"
  );

  const safeLoans = useMemo(
    () =>
      Array.isArray(loans)
        ? loans
        : [],
    [loans]
  );

  const borrowedLoans = useMemo(
    () =>
      safeLoans.filter((loan) => {
        const borrowerId =
          loan.borrowerId ??
          loan.borrower_id ??
          loan.borrower?.id;

        return (
          String(borrowerId) ===
          currentUserId
        );
      }),
    [safeLoans, currentUserId]
  );

  const lentLoans = useMemo(
    () =>
      safeLoans.filter((loan) => {
        const ownerId =
          loan.ownerId ??
          loan.owner_id ??
          loan.owner?.id ??
          loan.item?.ownerId ??
          loan.item?.owner_id;

        return (
          String(ownerId) ===
          currentUserId
        );
      }),
    [safeLoans, currentUserId]
  );

  const displayedLoans =
    activeTab === "borrowed"
      ? borrowedLoans
      : lentLoans;

  const getStatusClass = (status) =>
    String(status || "On Track")
      .toLowerCase()
      .replaceAll(" ", "-");

  const getItemName = (loan) => {
    if (
      loan.item &&
      typeof loan.item === "object"
    ) {
      return (
        loan.item.name ||
        "Equipment"
      );
    }

    return (
      loan.itemName ||
      loan.item_name ||
      loan.item ||
      "Equipment"
    );
  };

  const getItemId = (loan) =>
    loan.itemId ??
    loan.item_id ??
    loan.item?.id;

  const getPersonName = (
    loan,
    type
  ) => {
    if (loan.person) {
      return loan.person;
    }

    const person =
      type === "borrowed"
        ? loan.owner
        : loan.borrower;

    if (
      person &&
      typeof person === "object"
    ) {
      const firstName =
        person.firstName ||
        person.first_name ||
        "";

      const lastName =
        person.lastName ||
        person.last_name ||
        "";

      return (
        person.name ||
        [firstName, lastName]
          .filter(Boolean)
          .join(" ") ||
        "Neighbour"
      );
    }

    if (type === "borrowed") {
      return (
        loan.ownerName ||
        loan.owner_name ||
        "Neighbour"
      );
    }

    return (
      loan.borrowerName ||
      loan.borrower_name ||
      "Neighbour"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not provided";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setNotice("");
    setActionError("");
  };

  const handleMarkReturned = async (
    loanId
  ) => {
    setNotice("");
    setActionError("");
    setUpdatingLoanId(loanId);

    const selectedLoan =
      safeLoans.find(
        (loan) =>
          String(loan.id) ===
          String(loanId)
      );

    if (!selectedLoan) {
      setActionError(
        "The selected loan could not be found."
      );

      setUpdatingLoanId(null);
      return;
    }

    try {
      const loanResult =
        await updateLoanStatus(
          loanId,
          "Returned"
        );

      if (
        loanResult &&
        loanResult.success === false
      ) {
        throw new Error(
          loanResult.message ||
            "The loan could not be updated."
        );
      }

      const itemId =
        getItemId(selectedLoan);

      if (!itemId) {
        setNotice(
          "The loan was marked as returned."
        );

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
        error.message ||
          "The loan could not be marked as returned."
      );
    } finally {
      setUpdatingLoanId(null);
    }
  };

  const renderLoanCard = (
    loan,
    type
  ) => {
    const currentStatus =
      getLoanStatus(loan);

    const isReturned =
      String(currentStatus)
        .toLowerCase() ===
      "returned";

    const isUpdating =
      String(updatingLoanId) ===
      String(loan.id);

    const dueDate =
      loan.dueDate ||
      loan.due_date;

    const returnedAt =
      loan.returnedAt ||
      loan.returned_at;

    return (
      <article
        className="loan-page-card"
        key={loan.id}
      >
        <div className="loan-page-card-top">
          <div className="loan-page-item">
            <span className="loan-page-icon">
              {loan.icon ||
                loan.item?.icon ||
                "🧰"}
            </span>

            <div>
              <span className="loan-type-label">
                {type === "borrowed"
                  ? "BORROWED ITEM"
                  : "LENT ITEM"}
              </span>

              <h3>
                {getItemName(loan)}
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
              {type === "borrowed"
                ? "Borrowed from:"
                : "Lent to:"}
            </strong>{" "}
            {getPersonName(
              loan,
              type
            )}
          </p>

          <p>
            <strong>Due date:</strong>{" "}
            {formatDate(dueDate)}
          </p>

          {returnedAt && (
            <p>
              <strong>Returned:</strong>{" "}
              {formatDate(returnedAt)}
            </p>
          )}
        </div>

        {!isReturned && (
          <div className="loan-page-actions">
            <button
              className="return-item-button"
              type="button"
              disabled={isUpdating}
              onClick={() =>
                handleMarkReturned(
                  loan.id
                )
              }
            >
              {isUpdating
                ? "Updating..."
                : "Mark as Returned"}
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
            <p className="page-label">
              LOAN MANAGEMENT
            </p>

            <h1>Active Loans</h1>

            <p>
              View borrowed, lent,
              returned and overdue items.
            </p>
          </div>
        </header>

        {notice && (
          <div
            className="loan-action-notice success"
            role="status"
          >
            <span>{notice}</span>

            <button
              type="button"
              onClick={() =>
                setNotice("")
              }
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        {actionError && (
          <div
            className="loan-action-notice error"
            role="alert"
          >
            <span>{actionError}</span>

            <button
              type="button"
              onClick={() =>
                setActionError("")
              }
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <div
          className="loans-tab-switcher"
          role="tablist"
          aria-label="Loan categories"
        >
          <button
            type="button"
            role="tab"
            aria-selected={
              activeTab === "borrowed"
            }
            className={`loans-tab-button ${
              activeTab === "borrowed"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleTabChange(
                "borrowed"
              )
            }
          >
            Items I Borrowed

            <span className="loans-tab-count">
              {borrowedLoans.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={
              activeTab === "lent"
            }
            className={`loans-tab-button ${
              activeTab === "lent"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleTabChange("lent")
            }
          >
            Items I Lent Out

            <span className="loans-tab-count">
              {lentLoans.length}
            </span>
          </button>
        </div>

        <section
          className="loan-page-section"
          role="tabpanel"
        >
          <div className="loan-section-heading">
            <div>
              <h2>
                {activeTab === "borrowed"
                  ? "Items I Borrowed"
                  : "Items I Lent Out"}
              </h2>

              <p>
                {activeTab === "borrowed"
                  ? "Equipment you borrowed from your neighbours."
                  : "Equipment currently borrowed from you."}
              </p>
            </div>

            <span>
              {displayedLoans.length}
            </span>
          </div>

          <div className="loan-page-grid">
            {displayedLoans.length >
            0 ? (
              displayedLoans.map(
                (loan) =>
                  renderLoanCard(
                    loan,
                    activeTab
                  )
              )
            ) : (
              <div className="loan-page-empty">
                <span>🧰</span>

                <h3>
                  No{" "}
                  {activeTab ===
                  "borrowed"
                    ? "borrowed"
                    : "lent"}{" "}
                  items
                </h3>

                <p>
                  {activeTab ===
                  "borrowed"
                    ? "You have not borrowed any items."
                    : "You have not lent out any items."}
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Loans;