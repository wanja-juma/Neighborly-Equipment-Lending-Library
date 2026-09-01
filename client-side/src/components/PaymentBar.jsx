import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLoan, getItem, createPayment } from '../services/api';
import './PaymentBar.css';

function PaymentBar() {
  const { loanId } = useParams();
}

export default PaymentBar;
function PaymentBar() {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
}
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