import { useParams, Link } from 'react-router-dom';
import tools from '../data/tools';
import './ItemDetail.css';

function ItemDetail() {
  const { id } = useParams();
  const tool = tools.find((t) => t.id === id);

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
      <p className="item-rate">Ksh{tool.dailyRate}/day</p>
      <Link to={`/payment/${tool.id}`} className="borrow-btn">
        Borrow this item
      </Link>
    </div>
  );
}

export default ItemDetail;