import { useState } from "react";
import { initialBorrowingRequests } from "../data/requests";
import RequestsContext from "./RequestsContext";

function RequestsProvider({ children }) {
  const [borrowingRequests, setBorrowingRequests] =
    useState(initialBorrowingRequests);

  const addBorrowingRequest = (requestData) => {
    const duplicateRequest = borrowingRequests.find(
      (request) =>
        request.itemId === requestData.itemId &&
        request.borrowerId === requestData.borrowerId &&
        request.status === "Pending"
    );

    if (duplicateRequest) {
      return {
        success: false,
        message:
          "You already have a pending request for this item.",
      };
    }

    const newRequest = {
      id: Date.now(),
      ...requestData,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setBorrowingRequests((currentRequests) => [
      newRequest,
      ...currentRequests,
    ]);

    return {
      success: true,
      request: newRequest,
      message: "Borrowing request submitted successfully.",
    };
  };

  const updateRequestStatus = (requestId, newStatus) => {
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

    const requestExists = borrowingRequests.some(
      (request) => request.id === requestId
    );

    if (!requestExists) {
      return {
        success: false,
        message: "Borrowing request not found.",
      };
    }

    setBorrowingRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: newStatus,
            }
          : request
      )
    );

    return {
      success: true,
      message: `Request ${newStatus.toLowerCase()}.`,
    };
  };

  const cancelBorrowingRequest = (requestId) => {
    return updateRequestStatus(requestId, "Cancelled");
  };

  const value = {
    borrowingRequests,
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