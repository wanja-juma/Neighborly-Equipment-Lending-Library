import {
  useEffect,
  useState,
} from "react";

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

        setBorrowingRequests(requests);
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
    /*
     * Backend field names:
     *
     * user_id
     * equipment_id
     * start_date
     * end_date
     * status
     * message
     */

    const equipmentId =
      requestData.equipment_id ??
      requestData.item_id ??
      requestData.itemId;

    const userId =
      requestData.user_id ??
      requestData.borrower_id ??
      requestData.borrowerId;

    const startDate =
      requestData.start_date ??
      requestData.startDate;

    const endDate =
      requestData.end_date ??
      requestData.endDate;


    const duplicateRequest =
      borrowingRequests.find(
        (request) => {
          const existingEquipmentId =
            request.equipment_id ??
            request.item_id ??
            request.itemId;

          const existingUserId =
            request.user_id ??
            request.borrower_id ??
            request.borrowerId;

          const existingStatus =
            String(
              request.status || ""
            ).toLowerCase();

          return (
            String(existingEquipmentId) ===
              String(equipmentId) &&
            String(existingUserId) ===
              String(userId) &&
            existingStatus === "pending"
          );
        }
      );


    if (duplicateRequest) {
      return {
        success: false,
        message:
          "You already have a pending request for this item.",
      };
    }


    if (!equipmentId) {
      return {
        success: false,
        message:
          "The equipment ID is required.",
      };
    }


    if (!userId) {
      return {
        success: false,
        message:
          "The borrower ID is required.",
      };
    }


    if (!startDate || !endDate) {
      return {
        success: false,
        message:
          "Please select both borrowing dates.",
      };
    }


    try {
      /*
       * Convert the frontend camelCase
       * fields to the snake_case names
       * required by Flask.
       */
      const payload = {
        user_id: Number(userId),
        equipment_id:
          Number(equipmentId),

        start_date: startDate,
        end_date: endDate,

        status: "pending",

        message:
          requestData.message || null,
      };


      const data =
        await createBorrowingRequest(
          payload
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
    /*
     * The UI currently uses statuses such as:
     *
     * Approved
     * Declined
     * Cancelled
     *
     * Flask expects:
     *
     * approved
     * rejected
     * cancelled
     */

    const statusMap = {
      Pending: "pending",
      pending: "pending",

      Approved: "approved",
      approved: "approved",

      Declined: "rejected",
      declined: "rejected",

      Rejected: "rejected",
      rejected: "rejected",

      Cancelled: "cancelled",
      cancelled: "cancelled",
    };


    const backendStatus =
      statusMap[newStatus];


    if (!backendStatus) {
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
            status: backendStatus,
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


      const displayStatus =
        backendStatus === "rejected"
          ? "declined"
          : backendStatus;


      return {
        success: true,
        request: updatedRequest,
        message:
          `Request ${displayStatus}.`,
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