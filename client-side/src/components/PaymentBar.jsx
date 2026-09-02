import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLoan, getItem, createPayment } from '../services/api';
import './PaymentBar.css';

function PaymentBar() {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('500.00');
  const [submitting, setSubmitting] = useState(false);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    setLoading(true);
    getLoan(loanId)
      .then((loanData) => {
        setLoan(loanData);
        // LoanSchema only returns item_id, not a nested item — fetch it separately
        return getItem(loanData.item_id);
      })
      .then((itemData) => {
        setItem(itemData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [loanId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await createPayment({
        loan_id: loanId,
        amount,
        status: 'held',
      });
      setPayment(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="payment-bar">Loading loan details…</p>;
  }
  if (error && !loan) {
    return (
      <div className="payment-bar">
        <p>Couldn't load this loan: {error}</p>
        <Link to="/loans">Back to My Loans</Link>
      </div>
    );
  }

  if (payment) {
    return (
      <div className="payment-bar payment-success">
        <p>Deposit of Ksh{payment.amount} confirmed for {item?.name}. Enjoy your borrow!</p>
      </div>
    );
  }

  return (
    <form className="payment-bar" onSubmit={handleSubmit}>
      <h3>Pay Deposit — {item?.name}</h3>
      {error && <p className="payment-error">{error}</p>}
      <label>
        Deposit Amount (Ksh)
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Processing…' : 'Pay Now'}
      </button>
    </form>
  );
}


export default PaymentBar;
