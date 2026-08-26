const pool = require('../db/pool');

// Create a new borrowing request
async function createBorrowingRequest({ itemId, borrowerId, ownerId, status, message, notification }) {
  const result = await pool.query(
    `INSERT INTO borrowing_requests (item_id, borrower_id, owner_id, status, message, notification)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [itemId, borrowerId, ownerId, status, message, notification]
  );
  return result.rows[0];
}

// Get all borrowing requests
async function getAllBorrowingRequests() {
  const result = await pool.query(`SELECT * FROM borrowing_requests ORDER BY created_at DESC`);
  return result.rows;
}

// Get a single borrowing request by id
async function getBorrowingRequestById(id) {
  const result = await pool.query(`SELECT * FROM borrowing_requests WHERE id = $1`, [id]);
  return result.rows[0];
}

// Update a borrowing request's status
async function updateBorrowingRequestStatus(id, status) {
  const result = await pool.query(
    `UPDATE borrowing_requests SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
}

// Delete a borrowing request
async function deleteBorrowingRequest(id) {
  await pool.query(`DELETE FROM borrowing_requests WHERE id = $1`, [id]);
}

module.exports = {
  createBorrowingRequest,
  getAllBorrowingRequests,
  getBorrowingRequestById,
  updateBorrowingRequestStatus,
  deleteBorrowingRequest,
};