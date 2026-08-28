import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ShoppingCart, Check, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { getTools } from '../services/tools';
import './BrowseTools.css';

const ITEMS_PER_PAGE = 6;

// TEMPORARY placeholder — replace with your real auth check once AuthContext
// is wired in (e.g. `const { isLoggedIn } = useAuth();`). Returns false as a
// safe default so the Request flow stays gated until real auth exists.
function isLoggedIn() {
  return false;
}

function BrowseTools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getTools({ page, limit: ITEMS_PER_PAGE })
      .then(({ tools, totalPages }) => {
        setTools(tools);
        setTotalPages(totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page]);

  function isInCart(toolId) {
    return cart.some((item) => item.id === toolId);
  }

  function handleAddToCart(tool) {
    setCart((current) => {
      if (current.some((item) => item.id === tool.id)) return current;
      return [...current, tool];
    });
  }

  function handleRequest(tool) {
    if (!isLoggedIn()) {
      navigate('/login', { state: { redirectTo: `/dashboard/items/${tool.id}` } });
      return;
    }
    navigate(`/dashboard/items/${tool.id}`);
  }

  if (loading) {
    return <p className="browse-tools__status">Loading tools…</p>;
  }

  if (error) {
    return (
      <p className="browse-tools__status browse-tools__status--error">
        Couldn't load tools. Is json-server running on port 3001?
      </p>
    );
  }

  return (
    <section className="browse-tools">
      <div className="browse-tools__header">
        <h2 className="browse-tools__heading">Browse tools</h2>
        {cart.length > 0 && (
          <div className="browse-tools__cart-badge">
            <ShoppingCart size={16} />
            {cart.length} selected
          </div>
        )}
      </div>

      <div className="browse-tools__grid">
        {tools.map((tool) => {
          const available = tool.availability === 'Available';
          const inCart = isInCart(tool.id);

          return (
            <div className="tool-card" key={tool.id}>
              <div className="tool-card__icon-wrap">
                <span className="tool-card__icon" aria-hidden="true">
                  {tool.icon || '🔧'}
                </span>
                {!available && (
                  <span className="tool-card__badge">{tool.availability}</span>
                )}
              </div>

              <div className="tool-card__body">
                <p className="tool-card__name">{tool.name}</p>
                <p className="tool-card__condition">{tool.condition}</p>

                <div className="tool-card__meta">
                  {tool.owner && (
                    <span className="tool-card__owner">
                      <User size={13} /> {tool.owner}
                    </span>
                  )}
                  {tool.location && (
                    <span className="tool-card__location">
                      <MapPin size={13} /> {tool.location}
                    </span>
                  )}
                </div>

                <div className="tool-card__actions">
                  <button
                    type="button"
                    className="tool-card__btn tool-card__btn--request"
                    onClick={() => handleRequest(tool)}
                    disabled={!available}
                  >
                    Request
                  </button>
                  <button
                    type="button"
                    className="tool-card__btn tool-card__btn--cart"
                    onClick={() => handleAddToCart(tool)}
                    disabled={inCart}
                  >
                    {inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
                    {inCart ? 'Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="browse-tools__pagination">
          <button
            type="button"
            className="browse-tools__page-btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="browse-tools__page-label">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="browse-tools__page-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
}

export default BrowseTools;
