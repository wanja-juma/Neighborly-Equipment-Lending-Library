import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import tools from '../data/tools';
import './PaymentBar.css';

function PaymentBar() {
  const { id } = useParams();
  const tool = tools.find((t) => t.id === id);
  const [duration, setDuration] = useState(1);
  const [method, setMethod] = useState('mpesa');
  const [submitted, setSubmitted] = useState(false);

  if (!tool) {
    return (
      <div className="payment-bar">
        <p>Tool not found.</p>
        <Link to="/tools">Back to Browse Tools</Link>
      </div>
    );
  }

  const total = duration * tool.dailyRate;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="payment-bar payment-success">
        <p>Payment of Ksh{total} confirmed for {tool.name}. Enjoy your borrow!</p>
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

      <div className="payment-total">
        Total: <strong>Ksh{total}</strong>
      </div>

      <button type="submit">Pay Now</button>
    </form>
  );
}

export default PaymentBar;