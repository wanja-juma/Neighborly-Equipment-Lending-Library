import {
  Navigate,
  useParams,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useRequests from "../hooks/useRequests";


function PaymentRouteGuard({
  children,
}) {
  const { loanId } = useParams();

  const { currentUser } =
    useAuth();

  const {
    borrowingRequests,
    requestsLoading,
  } = useRequests();


  if (requestsLoading) {
    return (
      <main className="dashboard-main">
        <p>
          Checking payment access...
        </p>
      </main>
    );
  }


  const currentUserId =
    String(
      currentUser?.id || ""
    );


  const requests =
    Array.isArray(
      borrowingRequests
    )
      ? borrowingRequests
      : [];


  const approvedRequest =
    requests.find(
      (request) => {
        const status =
          String(
            request.status || ""
          ).toLowerCase();

        const borrowerId =
          request.user_id ??
          request.userId ??
          request.borrower_id ??
          request.borrowerId ??
          request.user?.id ??
          request.borrower?.id;

        const requestLoanId =
          request.loan_id ??
          request.loanId ??
          request.loan?.id;


        return (
          status === "approved" &&
          String(borrowerId) ===
            currentUserId &&
          String(requestLoanId) ===
            String(loanId)
        );
      }
    );


  if (!approvedRequest) {
    return (
      <Navigate
        to="/requests"
        replace
      />
    );
  }


  return children;
}


export default PaymentRouteGuard;