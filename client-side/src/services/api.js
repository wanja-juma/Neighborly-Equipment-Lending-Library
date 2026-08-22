const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

const request = async (endpoint, options = {}) => {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    options
  );

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}.`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

/* Items */

export const getItems = () => {
  return request("/items");
};

export const createItem = (itemData) => {
  return request("/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });
};

export const updateItem = (itemId, updates) => {
  return request(`/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
};

export const deleteItem = (itemId) => {
  return request(`/items/${itemId}`, {
    method: "DELETE",
  });
};

/* Borrowing requests */

export const getBorrowingRequests = () => {
  return request("/borrowingRequests");
};

export const createBorrowingRequest = (
  requestData
) => {
  return request("/borrowingRequests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
};

export const updateBorrowingRequest = (
  requestId,
  updates
) => {
  return request(
    `/borrowingRequests/${requestId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    }
  );
};

/* Loans */

export const getLoans = () => {
  return request("/loans");
};

export const updateLoan = (
  loanId,
  updatedData
) => {
  return request(`/loans/${loanId}`, {
    method: "PATCH",
    body: JSON.stringify(updatedData),
  });
};

/* Damage reports */

export const getDamageReports = () => {
  return request("/damageReports");
};

export const createDamageReport = (reportData) => {
  return request("/damageReports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportData),
  });
};