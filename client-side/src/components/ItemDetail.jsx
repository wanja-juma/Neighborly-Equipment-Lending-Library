import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import tools from '../data/tools';
import PaymentBar from './PaymentBar';
import './ItemDetail.css';

function ItemDetail() {
  const { id } = useParams();
  const tool = tools.find((t) => t.id === id);
  const [showPayment, setShowPayment] = useState(false);

  if (!tool) {
    return (
      <div className="item-detail">
        <p>Tool not found.</p>
        <Link to="/tools">Back to Browse Tools</Link>
      </div>
    );
  }

  return (
    <div className="item-detail">
      <Link to="/tools" className="back-link">&larr; Back to Browse Tools</Link>
      <h2>{tool.name}</h2>
      <p className="item-condition">Condition: {tool.condition}</p>
      <p>{tool.description}</p>
      <p className="item-rate">${tool.dailyRate}/day</p>

      {!showPayment ? (
        <button className="borrow-btn" onClick={() => setShowPayment(true)}>
          Borrow this item
        </button>
      ) : (
        <PaymentBar itemName={tool.name} dailyRate={tool.dailyRate} />
      )}
    </div>
  );
}

export default ItemDetail;