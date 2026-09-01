const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5555/api";

const getAccessToken = () => {
  return (
    localStorage.getItem(
      "neighborlyToken"
    ) ||
    localStorage.getItem(
      "access_token"
    )
  );
};

const request = async (
  endpoint,
  options = {}
) => {
  const token = getAccessToken();

  const headers = {
    ...options.headers,
  };

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  } catch {
    throw new Error(
      "Unable to connect to the server. Make sure the Flask server is running."
    );
  }

  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get(
      "content-type"
    );

  const responseBody =
    contentType?.includes(
      "application/json"
    )
      ? await response.json()
      : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "Your session has expired or you are not logged in. Please log in again."
      );
    }

    if (response.status === 403) {
      throw new Error(
        "You are not authorized to perform this action."
      );
    }

    const errorMessage =
      typeof responseBody === "object"
        ? responseBody?.error ||
          responseBody?.message
        : responseBody;

    throw new Error(
      errorMessage ||
        `Request failed with status ${response.status}.`
    );
  }

  return responseBody;
};

/* =========================
   Items
========================= */

export const getItems = async () => {
  const response = await request(
    "/items"
  );

  if (Array.isArray(response)) {
    return response;
  }

  return response?.items || [];
};

export const getItem = async (
  itemId
) => {
  const response = await request(
    `/items/${itemId}`
  );

  return response?.item || response;
};

export const createItem = async (
  itemData
) => {
  const response = await request(
    "/items",
    {
      method: "POST",
      body: JSON.stringify(itemData),
    }
  );

  return response?.item || response;
};

export const updateItem = async (
  itemId,
  updates
) => {
  const response = await request(
    `/items/${itemId}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    }
  );

  return response?.item || response;
};

export const deleteItem = (
  itemId
) => {
  return request(`/items/${itemId}`, {
    method: "DELETE",
  });
};

/* =========================
   Borrowing requests
========================= */

export const getBorrowingRequests =
  async () => {
    const response = await request(
      "/borrowing-requests"
    );

    if (Array.isArray(response)) {
      return response;
    }

    return (
      response?.borrowing_requests ||
      response?.borrowingRequests ||
      []
    );
  };

export const createBorrowingRequest =
  async (requestData) => {
    const response = await request(
      "/borrowing-requests",
      {
        method: "POST",
        body: JSON.stringify(
          requestData
        ),
      }
    );

    return (
      response?.borrowing_request ||
      response?.borrowingRequest ||
      response
    );
  };

export const updateBorrowingRequest =
  async (
    requestId,
    updates
  ) => {
    const response = await request(
      `/borrowing-requests/${requestId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      }
    );

    return (
      response?.borrowing_request ||
      response?.borrowingRequest ||
      response
    );
  };

export const deleteBorrowingRequest = (
  requestId
) => {
  return request(
    `/borrowing-requests/${requestId}`,
    {
      method: "DELETE",
    }
  );
};

/* =========================
   Loans
========================= */

export const getLoans = async () => {
  const response = await request(
    "/loans"
  );

  if (Array.isArray(response)) {
    return response;
  }

  return response?.loans || [];
};

export const getLoan = async (
  loanId
) => {
  const response = await request(
    `/loans/${loanId}`
  );

  return response?.loan || response;
};

export const createLoan = async (
  loanData
) => {
  const response = await request(
    "/loans",
    {
      method: "POST",
      body: JSON.stringify(loanData),
    }
  );

  return response?.loan || response;
};

export const updateLoan = async (
  loanId,
  updates
) => {
  const response = await request(
    `/loans/${loanId}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    }
  );

  return response?.loan || response;
};

export const deleteLoan = (
  loanId
) => {
  return request(`/loans/${loanId}`, {
    method: "DELETE",
  });
};

/* =========================
   Payments
========================= */

export const getPayment = async (
  paymentId
) => {
  const response = await request(
    `/payments/${paymentId}`
  );

  return (
    response?.payment || response
  );
};

export const createPayment = async (
  paymentData
) => {
  const response = await request(
    "/payments",
    {
      method: "POST",
      body: JSON.stringify(
        paymentData
      ),
    }
  );

  return (
    response?.payment || response
  );
};

export const refundPayment = async (
  paymentId
) => {
  const response = await request(
    `/payments/${paymentId}/refund`,
    {
      method: "PATCH",
    }
  );

  return (
    response?.payment || response
  );
};

/* =========================
   Memberships
========================= */

export const getMembership = async (membershipId) => {
  const response = await request(`/memberships/${membershipId}`);
  return response?.membership || response;
};

export const createMembership = async (membershipData) => {
  const response = await request("/memberships", {
    method: "POST",
    body: JSON.stringify(membershipData),
  });
  return response?.membership || response;
};

export const updateMembership = async (membershipId, updates) => {
  const response = await request(`/memberships/${membershipId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return response?.membership || response;
};

/* =========================
   Damage reports
========================= */

export const getDamageReports =
  async () => {
    const response = await request(
      "/damage-reports"
    );

    if (Array.isArray(response)) {
      return response;
    }

    return (
      response?.damage_reports ||
      response?.damageReports ||
      []
    );
  };

export const createDamageReport =
  async (reportData) => {
    const response = await request(
      "/damage-reports",
      {
        method: "POST",
        body: JSON.stringify(
          reportData
        ),
      }
    );

    return (
      response?.damage_report ||
      response?.damageReport ||
      response
    );
  };

export const updateDamageReport =
  async (
    reportId,
    updates
  ) => {
    const response = await request(
      `/damage-reports/${reportId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      }
    );

    return (
      response?.damage_report ||
      response?.damageReport ||
      response
    );
  };

export default request;