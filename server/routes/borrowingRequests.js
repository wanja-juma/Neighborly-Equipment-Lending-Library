const express = require('express');
const router = express.Router();
const {
  createBorrowingRequest,
  getAllBorrowingRequests,
  getBorrowingRequestById,
  updateBorrowingRequestStatus,
  deleteBorrowingRequest,
} = require('../models/borrowingRequest');

// GET all borrowing requests
router.get('/', async (req, res) => {
  try {
    const requests = await getAllBorrowingRequests();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single borrowing request
router.get('/:id', async (req, res) => {
  try {
    const request = await getBorrowingRequestById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new borrowing request
router.post('/', async (req, res) => {
  try {
    const newRequest = await createBorrowingRequest(req.body);
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update status
router.patch('/:id/status', async (req, res) => {
  try {
    const updated = await updateBorrowingRequestStatus(req.params.id, req.body.status);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a borrowing request
router.delete('/:id', async (req, res) => {
  try {
    await deleteBorrowingRequest(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;