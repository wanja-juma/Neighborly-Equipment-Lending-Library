import useRequests from "../hooks/useRequests";

function Requests() {
  const { borrowingRequests } = useRequests();

  const incomingRequests = borrowingRequests.filter(
    (request) => request.ownerId === 1
  );

  const outgoingRequests = borrowingRequests.filter(
    (request) => request.borrowerId === 1
  );

  return (
    <main className="dashboard-main">
      <section className="page-content">
        <h1>Borrowing Requests</h1>

        <p>
          Review incoming and outgoing borrowing requests.
        </p>

        <p>
          Incoming requests:{" "}
          <strong>{incomingRequests.length}</strong>
        </p>

        <p>
          Outgoing requests:{" "}
          <strong>{outgoingRequests.length}</strong>
        </p>
      </section>
    </main>
  );
}

export default Requests;