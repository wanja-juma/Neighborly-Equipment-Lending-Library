import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTools } from '../services/tools';
import './BrowseTools.css';

function BrowseTools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTools()
      .then((data) => {
        setTools(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="browse-tools__status">Loading tools…</p>;
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
      <h2 className="browse-tools__heading">Browse tools</h2>
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
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default BrowseTools;
