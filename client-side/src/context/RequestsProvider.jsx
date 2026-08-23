import { useEffect, useState } from "react";
import {
  createBorrowingRequest,
  getBorrowingRequests,
  updateBorrowingRequest,
} from "../services/api";
import RequestsContext from "./RequestsContext";

function RequestsProvider({ children }) {
  const [
    borrowingRequests,
    setBorrowingRequests,
  ] = useState([]);

  const [
    requestsLoading,
    setRequestsLoading,
  ] = useState(true);

  const [requestsError, setRequestsError] =
    useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setRequestsLoading(true);
        setRequestsError("");

        const data =
          await getBorrowingRequests();

        setBorrowingRequests(data);
      } catch (error) {
        setRequestsError(
          error.message ||
            "Failed to load borrowing requests."
        );
      } finally {
        setRequestsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const addBorrowingRequest = async (
    requestData
  ) => {
    const duplicateRequest =
      borrowingRequests.find(
        (request) =>
          request.itemId === requestData.itemId &&
          request.borrowerId ===
            requestData.borrowerId &&
          request.status === "Pending"
      );

    if (duplicateRequest) {
      return {
        success: false,
        message:
          "You already have a pending request for this item.",
      };
    }

    try {
      const newRequestData = {
        ...requestData,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      const savedRequest =
        await createBorrowingRequest(
          newRequestData
        );

      setBorrowingRequests(
        (currentRequests) => [
          savedRequest,
          ...currentRequests,
        ]
      );

      return {
        success: true,
        request: savedRequest,
        message:
          "Borrowing request submitted successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message ||
          "Failed to submit borrowing request.",
      };
    }
  };

  const updateRequestStatus = async (
    requestId,
    newStatus
  ) => {
    const allowedStatuses = [
      "Pending",
      "Approved",
      "Declined",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(newStatus)) {
      return {
        success: false,
        message: "Invalid request status.",
      };
    }

    try {
      const updatedRequest =
        await updateBorrowingRequest(
          requestId,
          {
            status: newStatus,
          }
        );

      setBorrowingRequests(
        (currentRequests) =>
          currentRequests.map((request) =>
            request.id === requestId
              ? updatedRequest
              : request
          )
      );

      return {
        success: true,
        request: updatedRequest,
        message: `Request ${newStatus.toLowerCase()}.`,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message ||
          "Failed to update request.",
      };
    }
  };

  const cancelBorrowingRequest = (
    requestId
  ) => {
    return updateRequestStatus(
      requestId,
      "Cancelled"
    );
  };

  const value = {
    borrowingRequests,
    requestsLoading,
    requestsError,
    addBorrowingRequest,
    updateRequestStatus,
    cancelBorrowingRequest,
  };

  return (
    <RequestsContext.Provider value={value}>
      {children}
    </RequestsContext.Provider>
  );
}

export default RequestsProvider;