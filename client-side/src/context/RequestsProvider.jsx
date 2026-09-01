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

  const [
    requestsError,
    setRequestsError,
  ] = useState("");


  useEffect(() => {
    const loadRequests = async () => {
      try {
        setRequestsLoading(true);
        setRequestsError("");

        const data =
          await getBorrowingRequests();

        const requests =
          Array.isArray(data)
            ? data
            : data?.borrowing_requests ||
              data?.borrowingRequests ||
              data?.requests ||
              [];

        setBorrowingRequests(
          requests
        );
      } catch (error) {
        console.error(
          "Failed to load borrowing requests:",
          error
        );

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
          String(
            request.itemId ??
              request.item_id
          ) ===
            String(
              requestData.itemId ??
                requestData.item_id
            ) &&
          String(
            request.borrowerId ??
              request.borrower_id
          ) ===
            String(
              requestData.borrowerId ??
                requestData.borrower_id
            ) &&
          String(
            request.status
          ).toLowerCase() ===
            "pending"
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
      };

      const data =
        await createBorrowingRequest(
          newRequestData
        );

      const savedRequest =
        data?.borrowing_request ||
        data?.borrowingRequest ||
        data?.request ||
        data;

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
      console.error(
        "Failed to create borrowing request:",
        error
      );

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

    if (
      !allowedStatuses.includes(
        newStatus
      )
    ) {
      return {
        success: false,
        message:
          "Invalid request status.",
      };
    }

    try {
      const data =
        await updateBorrowingRequest(
          requestId,
          {
            status: newStatus,
          }
        );

      const updatedRequest =
        data?.borrowing_request ||
        data?.borrowingRequest ||
        data?.request ||
        data;

      setBorrowingRequests(
        (currentRequests) =>
          currentRequests.map(
            (request) =>
              String(request.id) ===
              String(requestId)
                ? updatedRequest
                : request
          )
      );

      return {
        success: true,
        request: updatedRequest,
        message:
          `Request ${newStatus.toLowerCase()}.`,
      };
    } catch (error) {
      console.error(
        "Failed to update request:",
        error
      );

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
    <RequestsContext.Provider
      value={value}
    >
      {children}
    </RequestsContext.Provider>
  );
}


export default RequestsProvider;