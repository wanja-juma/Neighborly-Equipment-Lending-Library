import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLoan, getItem, createPayment } from '../services/api';
import './PaymentBar.css';

function PaymentBar() {
  const { loanId } = useParams();
}

export default PaymentBar;