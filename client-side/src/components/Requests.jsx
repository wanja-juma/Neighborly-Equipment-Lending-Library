import React, { useState, useEffect } from 'react';
import {
  getBorrowingRequests,
  updateBorrowingRequest,
  createBorrowingRequest,
} from '../services/api';

export default function RequestsView() {
  const [activeTab, setActiveTab] = useState('incoming');
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  // New request form state (outgoing tab)
  const [itemId, setItemId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      const data = await getBorrowingRequests(activeTab);
      setRequests(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateBorrowingRequest(id, { status: newStatus });
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateRequest = async () => {
    if (!itemId || !startDate || !endDate) {
      setFeedback({ type: 'error', text: 'Item ID and both dates are required.' });
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      await createBorrowingRequest({
        equipment_id: Number(itemId),
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        message: message || undefined,
      });
      setFeedback({ type: 'success', text: 'Request sent!' });
      setItemId('');
      setStartDate('');
      setEndDate('');
      setMessage('');
      fetchRequests();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ marginLeft: '260px', padding: '30px', width: 'calc(100% - 260px)', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Borrowing Requests</h1>
        <p style={{ fontSize: '14px', color: '#666' }}>Manage requests for borrowing and lending equipment.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('incoming')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            background: activeTab === 'incoming' ? '#1b4332' : '#f0f0f0',
            color: activeTab === 'incoming' ? '#fff' : '#333',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Incoming
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            background: activeTab === 'outgoing' ? '#1b4332' : '#f0f0f0',
            color: activeTab === 'outgoing' ? '#fff' : '#333',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Outgoing
        </button>
      </div>

      {/* New Request form — only on Outgoing tab */}
      {activeTab === 'outgoing' && (
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Request to Borrow</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <input
              type="number"
              placeholder="Item ID"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }}
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <textarea
            placeholder="Note (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', boxSizing: 'border-box' }}
          />
          <button
            onClick={handleCreateRequest}
            disabled={submitting}
            style={{ background: '#1b4332', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
          >
            {submitting ? 'Sending…' : 'Request to Borrow'}
          </button>
          {feedback && (
            <p style={{ color: feedback.type === 'error' ? 'red' : 'green', fontSize: '13px', marginTop: '8px' }}>
              {feedback.text}
            </p>
          )}
        </div>
      )}

      {/* Content Container */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'capitalize', marginBottom: '4px' }}>{activeTab} Requests</h2>
        <p style={{ fontSize: '12px', color: '#777', marginBottom: '20px' }}>
          {activeTab === 'incoming' ? 'Requests from neighbours who want to borrow your items.' : 'Requests you have made to borrow items.'}
        </p>

        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}

        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: '40px', height: '40px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontWeight: 'bold' }}>✓</div>
            <p style={{ color: '#333', fontWeight: '500' }}>No {activeTab} requests</p>
            <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>You have no {activeTab} borrowing requests.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {requests.map((req) => (
              <div key={req.id} style={{ border: '1px solid #eaeaea', padding: '15px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#333' }}>Request #{req.id}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>Status: <span style={{ fontWeight: '500', color: '#2e7d32', textTransform: 'capitalize' }}>{req.status}</span></p>
                </div>
                {activeTab === 'incoming' && req.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleStatusUpdate(req.id, 'approved')}
                      style={{ background: '#2e7d32', color: '#fff', border: 'none', fontSize: '12px', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(req.id, 'rejected')}
                      style={{ background: '#d32f2f', color: '#fff', border: 'none', fontSize: '12px', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}