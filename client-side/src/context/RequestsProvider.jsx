import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  createBorrowingRequest,
  getBorrowingRequests,
  updateBorrowingRequest as updateBorrowingRequestApi,
} from "../services/api";

import useAuth from "../hooks/useAuth";
import RequestsContext from "./RequestsContext";


function RequestsProvider({
  children,
}) {
  const {
    currentUser,
  } = useAuth();


  const [
    borrowingRequests,
    setBorrowingRequests,
  ] = useState([]);


  const [
    requestsLoading,
    setRequestsLoading,
  ] = useState(
    Boolean(currentUser)
  );


  const [
    requestsError,
    setRequestsError,
  ] = useState("");


  /*
   * Normalize the response returned
   * from the Flask API.
   */
  const normalizeRequests = (
    data
  ) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (
      Array.isArray(
        data?.borrowing_requests
      )
    ) {
      return data.borrowing_requests;
    }

    if (
      Array.isArray(
        data?.borrowingRequests
      )
    ) {
      return data.borrowingRequests;
    }

    if (
      Array.isArray(
        data?.requests
      )
    ) {
      return data.requests;
    }

    return [];
  };


  /*
   * Manually refresh borrowing
   * requests.
   *
   * Used by Requests.jsx when the
   * browser regains focus or after
   * approving/declining a request.
   */
  const refreshRequests =
    useCallback(
      async () => {
        if (!currentUser) {
          return [];
        }

        try {
          setRequestsLoading(true);
          setRequestsError("");

          const data =
            await getBorrowingRequests();

          const requests =
            normalizeRequests(data);

          setBorrowingRequests(
            requests
          );

          return requests;
        } catch (error) {
          setRequestsError(
            error.message ||
              "Failed to load borrowing requests."
          );

          return [];
        } finally {
          setRequestsLoading(
            false
          );
        }
      },
      [currentUser]
    );


  /*
   * Load requests when a user
   * becomes authenticated.
   *
   * IMPORTANT:
   * We do not synchronously call
   * setState when currentUser is null.
   */
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    let cancelled = false;


    const loadRequests =
      async () => {
        try {
          /*
           * Wait for the external API
           * before updating React state.
           */
          const data =
            await getBorrowingRequests();

          if (cancelled) {
            return;
          }

          const requests =
            normalizeRequests(data);

          setBorrowingRequests(
            requests
          );

          setRequestsError("");
        } catch (error) {
          if (cancelled) {
            return;
          }

          setRequestsError(
            error.message ||
              "Failed to load borrowing requests."
          );
        } finally {
          if (!cancelled) {
            setRequestsLoading(
              false
            );
          }
        }
      };


    loadRequests();


    return () => {
      cancelled = true;
    };
  }, [currentUser]);


  /*
   * Find one request from the
   * requests currently stored
   * in context.
   */
  const getBorrowingRequestById =
    (requestId) => {
      return (
        borrowingRequests.find(
          (request) =>
            String(request.id) ===
            String(requestId)
        ) || null
      );
    };


  /*
   * Create a new borrowing request.
   */
  const addBorrowingRequest =
    async (requestData) => {
      try {
        setRequestsError("");

        const createdRequest =
          await createBorrowingRequest(
            requestData
          );


        const request =
          createdRequest
            ?.borrowing_request ??
          createdRequest
            ?.borrowingRequest ??
          createdRequest
            ?.request ??
          createdRequest;


        if (request) {
          setBorrowingRequests(
            (currentRequests) => [
              request,
              ...currentRequests,
            ]
          );
        }


        return request;
      } catch (error) {
        setRequestsError(
          error.message ||
            "Unable to create borrowing request."
        );

        throw error;
      }
    };


  /*
   * Update the status or other
   * fields of a borrowing request.
   *
   * Examples:
   *
   * pending -> approved
   * pending -> declined
   */
   const updateRequestStatus = async (requestId, status) => {
  const payload =
    typeof status === "object" ? status : { status };

  const result = await updateBorrowingRequestApi(
    requestId,
    payload
  );

  const updatedRequest =
    result?.borrowing_request ??
    result?.borrowingRequest ??
    result?.request ??
    result;

  if (updatedRequest) {
    setBorrowingRequests((currentRequests) =>
      currentRequests.map((request) =>
        String(request.id) === String(requestId)
          ? { ...request, ...updatedRequest }
          : request
      )
    );
  }
  return updatedRequest;
};

  


  /*
   * Requests.jsx currently calls:
   *
   * updateBorrowingRequest(
   *   request.id,
   *   { status: "approved" }
   * )
   *
   * Keep this alias so the existing
   * Requests.jsx does not need to
   * change.
   */
  const updateBorrowingRequest =
    async (
      requestId,
      requestData
    ) => {
      return updateRequestStatus(
        requestId,
        requestData
      );
    };


  /*
   * When there is no logged-in user,
   * expose an empty request list
   * without calling setState inside
   * the effect.
   */
  const visibleBorrowingRequests =
    currentUser
      ? borrowingRequests
      : [];


  const value = {
    borrowingRequests:
      visibleBorrowingRequests,

    requestsLoading:
      currentUser
        ? requestsLoading
        : false,

    requestsError,

    getBorrowingRequestById,

    addBorrowingRequest,

    refreshRequests,

    updateRequestStatus,

    updateBorrowingRequest,
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