import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTools } from '../services/tools';
import './BrowseTools.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  ShoppingCart,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { getTools } from "../services/tools";
import useAuth from "../hooks/useAuth.js";
import "./BrowseTools.css";

const ITEMS_PER_PAGE = 6;

function BrowseTools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    setLoading(true);
    setError(null);

    getTools({
      page,
      limit: ITEMS_PER_PAGE,
    })
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
      if (current.some((item) => item.id === tool.id)) {
        return current;
      }

      return [...current, tool];
    });
  }

  function handleRequest(tool) {
    if (!currentUser) {
      navigate("/auth?mode=login", {
        state: {
          redirectTo: `/tools/${tool.id}`,
        },
      });
      return;
    }

    navigate(`/tools/${tool.id}`);
  }

  if (loading) {
    return (
      <p className="browse-tools__status">
        Loading tools…
      </p>
    );
  }

  if (error) {
    return (
      <p className="browse-tools__status browse-tools__status--error">
        Couldn't load tools. Make sure the Flask server is running.
      </p>
    );
  }

  return (
    <section className="browse-tools">
      <div className="browse-tools__header">
        <h2 className="browse-tools__heading">
          Browse tools
        </h2>

        {cart.length > 0 && (
          <div className="browse-tools__cart-badge">
            <ShoppingCart size={16} />
            {cart.length} selected
          </div>
        )}
      </div>

      <div className="browse-tools__grid">
        {tools.map((tool) => (
          <Link to={`/tools/${tool.id}`} key={tool.id} className="tool-card">
            <div className="tool-card__image-wrap">
              <img
                src={tool.image}
                alt={tool.name}
                className="tool-card__image"
              />
              {tool.status !== 'Available' && (
                <span className="tool-card__badge">{tool.status}</span>
              )}
            </div>
            <div className="tool-card__body">
              <p className="tool-card__name">{tool.name}</p>
              <p className="tool-card__condition">{tool.condition}</p>
        {tools.map((tool) => {
          const available =
            tool.availability === "Available";

          const inCart = isInCart(tool.id);

          return (
            <div
              className="tool-card"
              key={tool.id}
            >
              <div className="tool-card__icon-wrap">
                <span
                  className="tool-card__icon"
                  aria-hidden="true"
                >
                  {tool.icon || "🔧"}
                </span>

                {!available && (
                  <span className="tool-card__badge">
                    {tool.availability}
                  </span>
                )}
              </div>

              <div className="tool-card__body">
                <p className="tool-card__name">
                  {tool.name}
                </p>

                <p className="tool-card__condition">
                  {tool.condition}
                </p>

                <div className="tool-card__meta">
                  {tool.owner && (
                    <span className="tool-card__owner">
                      <User size={13} />
                      {tool.owner}
                    </span>
                  )}

                  {tool.location && (
                    <span className="tool-card__location">
                      <MapPin size={13} />
                      {tool.location}
                    </span>
                  )}
                </div>

                <div className="tool-card__actions">
                  <button
                    type="button"
                    className="tool-card__btn tool-card__btn--request"
                    onClick={() =>
                      handleRequest(tool)
                    }
                    disabled={!available}
                  >
                    Request
                  </button>

                  <button
                    type="button"
                    className="tool-card__btn tool-card__btn--cart"
                    onClick={() =>
                      handleAddToCart(tool)
                    }
                    disabled={inCart}
                  >
                    {inCart ? (
                      <Check size={14} />
                    ) : (
                      <ShoppingCart size={14} />
                    )}

                    {inCart
                      ? "Added"
                      : "Add to Cart"}
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
            onClick={() =>
              setPage((p) => p - 1)
            }
            disabled={page === 1}
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          <span className="browse-tools__page-label">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            className="browse-tools__page-btn"
            onClick={() =>
              setPage((p) => p + 1)
            }
            disabled={page === totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
}

export default BrowseTools;