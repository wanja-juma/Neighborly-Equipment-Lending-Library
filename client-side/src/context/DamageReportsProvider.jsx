import { useEffect, useState } from "react";
import {
  createDamageReport,
  getDamageReports,
  updateDamageReport,
} from "../services/api";
import DamageReportsContext from "./DamageReportsContext.js";


function DamageReportsProvider({
  children,
}) {
  const [
    damageReports,
    setDamageReports,
  ] = useState([]);

  const [
    damageReportsLoading,
    setDamageReportsLoading,
  ] = useState(true);

  const [
    damageReportsError,
    setDamageReportsError,
  ] = useState("");

  useEffect(() => {
    const loadDamageReports = async () => {
      try {
        setDamageReportsLoading(true);
        setDamageReportsError("");

        const data = await getDamageReports();

        setDamageReports(data);
      } catch (error) {
        setDamageReportsError(
          error.message ||
            "Failed to load damage reports."
        );
      } finally {
        setDamageReportsLoading(false);
      }
    };

    loadDamageReports();
  }, []);

  const addDamageReport = async (
    reportData
  ) => {
    const existingReport = damageReports.find(
      (report) =>
        String(report.loanId) ===
          String(reportData.loanId) &&
        report.status?.toLowerCase() !==
          "resolved"
    );

    if (existingReport) {
      return {
        success: false,
        message:
          "An unresolved damage report already exists for this loan.",
      };
    }

    try {
      const newReportData = {
        ...reportData,
        status: "Submitted",
        createdAt: new Date().toISOString(),
        resolvedAt: null,
      };

      const savedReport =
        await createDamageReport(
          newReportData
        );

      setDamageReports(
        (currentReports) => [
          savedReport,
          ...currentReports,
        ]
      );

      return {
        success: true,
        report: savedReport,
        message:
          "Damage report submitted successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message ||
          "Failed to submit the damage report.",
      };
    }
  };

  const updateDamageReportStatus = async (
  reportId,
  newStatus
) => {
  const allowedStatuses = [
    "Submitted",
    "Under Review",
    "Resolved",
  ];

  if (!allowedStatuses.includes(newStatus)) {
    return {
      success: false,
      message:
        "Invalid damage report status.",
    };
  }

  try {
    const updates = {
      status: newStatus,
      resolvedAt:
        newStatus === "Resolved"
          ? new Date().toISOString()
          : null,
    };

    const updatedReport =
      await updateDamageReport(
        reportId,
        updates
      );

    setDamageReports((currentReports) =>
      currentReports.map((report) =>
        String(report.id) ===
        String(reportId)
          ? updatedReport
          : report
      )
    );

    return {
      success: true,
      report: updatedReport,
      message: `Damage report marked as ${newStatus.toLowerCase()}.`,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.message ||
        "Failed to update the damage report.",
    };
  }
};

  const value = {
  damageReports,
  damageReportsLoading,
  damageReportsError,
  addDamageReport,
  updateDamageReportStatus,
};

  return (
    <DamageReportsContext.Provider
      value={value}
    >
      {children}
    </DamageReportsContext.Provider>
  );
}

export default DamageReportsProvider;