import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useRequests from "../hooks/useRequests";

import "./Dashboard.css";


const navigationItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Browse Items",
    path: "/items",
  },
  {
    name: "My Listings",
    path: "/listings",
  },
  {
    name: "Requests",
    path: "/requests",
  },
  {
    name: "Loans",
    path: "/loans",
  },
  {
    name: "Damage Reports",
    path: "/damage-reports",
  },
];


function DashboardLayout() {
  const {
    logout,
    currentUser,
  } = useAuth();

  const {
    borrowingRequests,
  } = useRequests();

  const navigate =
    useNavigate();


  const currentUserId =
    String(
      currentUser?.id || ""
    );


  const safeRequests =
    Array.isArray(
      borrowingRequests
    )
      ? borrowingRequests
      : [];


  const approvedPaymentRequests =
    safeRequests.filter(
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

        const loanId =
          request.loan_id ??
          request.loanId ??
          request.loan?.id;


        return (
          status === "approved" &&
          String(borrowerId) ===
            currentUserId &&
          Boolean(loanId)
        );
      }
    );


  const paymentRequest =
    approvedPaymentRequests[0];


  const paymentLoanId =
    paymentRequest?.loan_id ??
    paymentRequest?.loanId ??
    paymentRequest?.loan?.id ??
    null;


  const canAccessPayments =
    Boolean(paymentLoanId);


  const handleLogout = () => {
    logout();

    navigate(
      "/auth",
      {
        replace: true,
      }
    );
  };


  return (
    <div className="neighborly-app">

      <aside className="sidebar">

        <div className="logo">
          <span className="logo-icon">
            N
          </span>

          <span className="logo-text">
            Neighborly
          </span>
        </div>


        <nav className="sidebar-navigation">

          {navigationItems.map(
            (item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "navigation-link active"
                    : "navigation-link"
                }
              >
                <span className="navigation-icon">
                  ○
                </span>

                <span>
                  {item.name}
                </span>
              </NavLink>
            )
          )}


          {canAccessPayments ? (
            <NavLink
              to={`/payments/${paymentLoanId}`}
              className={({
                isActive,
              }) =>
                isActive
                  ? "navigation-link active"
                  : "navigation-link"
              }
            >
              <span className="navigation-icon">
                ○
              </span>

              <span>
                Payments
              </span>
            </NavLink>
          ) : (
            <span
              className="
                navigation-link
                navigation-link-disabled
              "
              title="Payments become available after a borrowing request is approved."
            >
              <span className="navigation-icon">
                ○
              </span>

              <span>
                Payments
              </span>
            </span>
          )}

        </nav>


        <div className="community-card">
          <span className="community-icon">
            ⌂
          </span>

          <div>
            <small>
              Your community
            </small>

            <strong>
              Greenview Estate
            </strong>
          </div>
        </div>


        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          Log out
        </button>

      </aside>

      <Outlet />

    </div>
  );
}


export default DashboardLayout;