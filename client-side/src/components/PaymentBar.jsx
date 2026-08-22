import { useState } from 'react';
import './PaymentBar.css';

function PaymentBar({ itemName = 'this tool', dailyRate = 5 }) {
  const [duration, setDuration] = useState(1);
  const [method, setMethod] = useState('mpesa');
  const [submitted, setSubmitted] = useState(false);

  const total = duration * dailyRate;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="payment-bar payment-success">
        <p>Payment of ${total} confirmed for {itemName}. Enjoy your borrow!</p>
      </div>
    );
  }

  return (
    <form className="payment-bar" onSubmit={handleSubmit}>
      <h3>Borrow {itemName}</h3>

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
        Total: <strong>${total}</strong>
      </div>

      <button type="submit">Pay Now</button>
    </form>
  );
}

export default PaymentBar;