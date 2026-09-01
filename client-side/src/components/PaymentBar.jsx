import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItem } from '../services/api';
import './PaymentBar.css';

function PaymentBar() {
  const { id } = useParams();
  const [tool, setTool] = useState(undefined);
  const [duration, setDuration] = useState(1);
  const [method, setMethod] = useState('mpesa');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getItem(id)
      .then((data) => {
        if (!cancelled) setTool(data);
      })
      .catch(() => {
        if (!cancelled) setTool(null);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (tool === undefined) {
    return (
      <div className="payment-bar">
        <p>Loading…</p>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="payment-bar">
        <p>Tool not found.</p>
        <Link to="/tools">Back to Browse Tools</Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="payment-bar payment-success">
        <p>Borrow request sent for {tool.name}. The owner will confirm shortly.</p>
      </div>
    );
  }

  return (
    <form className="payment-bar" onSubmit={handleSubmit}>
      <h3>Borrow {tool.name}</h3>

      <label>
        Duration (days)
        <input
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </label>

      <label>
        Payment Method
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="mpesa">M-Pesa</option>
          <option value="card">Card</option>
          <option value="cash">Cash on Pickup</option>
        </select>
      </label>

      <button type="submit">Send Borrow Request</button>
    </form>
  );
}

export default PaymentBar;