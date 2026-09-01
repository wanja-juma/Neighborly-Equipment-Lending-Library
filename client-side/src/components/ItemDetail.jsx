import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItem } from '../services/api';
import './ItemDetail.css';

function ItemDetail() {
  const { id } = useParams();
  const [tool, setTool] = useState(undefined);

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
      <div className="item-detail">
        <p>Loading…</p>
      </div>
    );
  }

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
      <p className="item-rate">Status: {tool.status}</p>
      <Link to={`/payment/${tool.id}`} className="borrow-btn">
        Borrow this item
      </Link>
    </div>
  );
}

export default ItemDetail;