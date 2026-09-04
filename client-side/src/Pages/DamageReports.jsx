import { useState } from "react";
import useDamageReports from "../hooks/useDamageReports";
import useAuth from "../hooks/useAuth";
import useLoans from "../hooks/useLoans";
import "./DamageReports.css";

const CURRENT_USER_ID = "1";

const initialFormData = {
  loanId: "",
  severity: "",
  description: "",
};

function DamageReports() {
  const { currentUser } = useAuth();

  const {
  damageReports,
  damageReportsLoading,
  damageReportsError,
  addDamageReport,
  updateDamageReportStatus,
} = useDamageReports();

  const {
    loans,
    loansLoading,
    loansError,
  } = useLoans();

  const [formData, setFormData] =
    useState(initialFormData);
  const [formErrors, setFormErrors] =
    useState({});
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
    const [statusError, setStatusError] =
  useState("");

const [
  updatingReportId,
  setUpdatingReportId,
] = useState(null);

  const userLoans = loans.filter(
      (loan) =>
    String(loan.ownerId) ===
      String(currentUser?.id) ||
    String(loan.borrowerId) ===
      String(currentUser?.id)
    );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
      submit: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.loanId) {
      newErrors.loanId =
        "Please select the affected loan.";
    }

    if (!formData.severity) {
      newErrors.severity =
        "Please select the damage severity.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Please describe the damage.";
    } else if (
      formData.description.trim().length < 10
    ) {
      newErrors.description =
        "The description must contain at least 10 characters.";
    }

    setFormErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice("");

    if (!validateForm()) {
      return;
    }

    const selectedLoan = loans.find(
      (loan) =>
        String(loan.id) ===
        String(formData.loanId)
    );

    if (!selectedLoan) {
      setFormErrors({
        submit:
          "The selected loan could not be found.",
      });
      return;
    }

    setIsSubmitting(true);

  const result = await addDamageReport({
  loan_id: selectedLoan.id,
  severity: formData.severity,
  notes: formData.description.trim(),
  });

    if (result.success) {
      setNotice(result.message);
      setFormData(initialFormData);
      setFormErrors({});
    } else {
      setFormErrors({
        submit: result.message,
      });
    }

    setIsSubmitting(false);
  };

  const handleReportStatus = async (
  reportId,
  newStatus
) => {
  setNotice("");
  setStatusError("");
  setUpdatingReportId(reportId);

  const result =
    await updateDamageReportStatus(
      reportId,
      newStatus
    );

  if (result.success) {
    setNotice(result.message);
  } else {
    setStatusError(result.message);
  }

  setUpdatingReportId(null);
};

  if (
    damageReportsLoading ||
    loansLoading
  ) {
    return (
      <main className="dashboard-main">
        <section className="page-content">
          <p>Loading damage reports...</p>
        </section>
      </main>
    );
  }

  if (damageReportsError || loansError) {
    return (
      <main className="dashboard-main">
        <section className="page-content">
          <p>
            {damageReportsError || loansError}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-main">
      <section className="page-content damage-page">
        <header className="damage-page-header">
          <div>
            <p className="page-label">
              EQUIPMENT SUPPORT
            </p>

            <h1>Damage Reports</h1>

            <p>
              Submit and review equipment damage
              reports.
            </p>
          </div>

          <div className="damage-report-total">
            <strong>
              {damageReports.length}
            </strong>
            <span>Total Reports</span>
          </div>
        </header>

        {notice && (
          <p
            className="damage-notice success"
            role="status"
          >
            {notice}
          </p>
        )}

        {statusError && (
  <p
    className="damage-notice error"
    role="alert"
  >
    {statusError}
  </p>
)}

        <div className="damage-page-layout">
          <form
            className="damage-report-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="damage-form-heading">
              <h2>Report Item Damage</h2>

              <p>
                Provide clear information about the
                affected equipment.
              </p>
            </div>

            <label className="item-form-field">
              <span>
                Affected Loan <b>*</b>
              </span>

              <select
                name="loanId"
                value={formData.loanId}
                onChange={handleChange}
                className={
                  formErrors.loanId
                    ? "input-error"
                    : ""
                }
              >
                <option value="">
                  Select a loan
                </option>

                {userLoans.map((loan) => (
                  <option
                    key={loan.id}
                    value={loan.id}
                  >
                    {loan.item ||
                      loan.itemName ||
                      "Equipment"}{" "}
                    — Due{" "}
                    {loan.dueDate ||
                      "date unavailable"}
                  </option>
                ))}
              </select>

              {formErrors.loanId && (
                <small className="field-error">
                  {formErrors.loanId}
                </small>
              )}
            </label>

            <label className="item-form-field">
              <span>
                Damage Severity <b>*</b>
              </span>

              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className={
                  formErrors.severity
                    ? "input-error"
                    : ""
                }
              >
                <option value="">
                  Select severity
                </option>
                <option value="low">
                  Low
                </option>
                <option value="medium">
                  Medium
                </option>
                <option value="high">
                  High
                </option>
              </select>

              {formErrors.severity && (
                <small className="field-error">
                  {formErrors.severity}
                </small>
              )}
            </label>

            <label className="item-form-field">
              <span>
                Damage Description <b>*</b>
              </span>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                maxLength="500"
                placeholder="Describe what happened and the visible damage..."
                className={
                  formErrors.description
                    ? "input-error"
                    : ""
                }
              />

              <div className="description-help">
                {formErrors.description ? (
                  <small className="field-error">
                    {formErrors.description}
                  </small>
                ) : (
                  <small>
                    Include visible damage and how
                    it occurred.
                  </small>
                )}

                <small>
                  {formData.description.length}/500
                </small>
              </div>
            </label>

            {formErrors.submit && (
              <p
                className="damage-notice error"
                role="alert"
              >
                {formErrors.submit}
              </p>
            )}

            <button
              className="submit-damage-button"
              type="submit"
              disabled={
                isSubmitting ||
                userLoans.length === 0
              }
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Damage Report"}
            </button>

            {userLoans.length === 0 && (
              <small className="field-error">
                You need a loan before submitting
                a damage report.
              </small>
            )}
          </form>

          <section className="damage-reports-list">
            <div className="damage-list-heading">
              <h2>Submitted Reports</h2>

              <p>
                Track previously submitted damage
                reports.
              </p>
            </div>

            {damageReports.length > 0 ? (
              damageReports.map((report) => (
                <article
                  className="damage-report-card"
                  key={report.id}
                >
                  <div className="damage-card-top">
                    <div className="damage-item">
                      <span>
                        {report.itemIcon || "🧰"}
                      </span>

                      <div>
                        <h3>
                          {report.itemName ||
                            "Equipment"}
                        </h3>

                        <small>
                          Report #{report.id}
                        </small>
                      </div>
                    </div>

                    <span
                      className={`damage-status ${report.status
                        ?.toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {report.status ||
                        "Submitted"}
                    </span>
                  </div>

                  <div className="damage-card-details">
                    <p>
                      <strong>Severity:</strong>{" "}
                      <span
                        className={`damage-severity ${report.severity?.toLowerCase()}`}
                      >
                        {report.severity}
                      </span>
                    </p>

                    <p>{report.notes}</p>

                    <small>
                      Submitted{" "}
                      {report.created_at
                        ? new Date(
                            report.created_at
                          ).toLocaleDateString()
                        : "recently"}
                    </small>
                  </div>

                {report.status?.toLowerCase() === "pending" && (
  <div className="damage-report-actions">
    <button
      className="resolve-report-button"
      type="button"
      disabled={
        String(updatingReportId) ===
        String(report.id)
      }
      onClick={() =>
        handleReportStatus(
          report.id,
          "resolved"
        )
      }
    >
      {updatingReportId === report.id
        ? "Updating..."
        : "Mark as Resolved"}
    </button>
  </div>
  )}
                </article>
              ))
            ) : (
              <div className="damage-empty-state">
                <span>✓</span>

                <div>
                  <strong>
                    No damage reports
                  </strong>

                  <p>
                    Submitted reports will appear
                    here.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

export default DamageReports;