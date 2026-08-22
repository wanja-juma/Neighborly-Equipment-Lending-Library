import { useState, useEffect } from 'react';


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
        Couldn't load tools. Is json-server running on port 3001?
      </p>
    );
  }

    return (
    <section className="browse-tools">
      <h2 className="browse-tools__heading">Browse tools</h2>
      <div className="browse-tools__grid">
        {tools.map((tool) => (
          <div className="tool-card" key={tool.id}>
            <div className="tool-card__image-wrap">
              <img
                src={tool.imageUrl}
                alt={tool.name}
                className="tool-card__image"
              />
              {!tool.available && (
                <span className="tool-card__badge">Unavailable</span>
              )}
            </div>
            <div className="tool-card__body">
              <p className="tool-card__name">{tool.name}</p>
              <p className="tool-card__price">KSh {tool.pricePerDay} / day</p>
              <p className="tool-card__condition">{tool.condition}</p>
              <p className="tool-card__distance">
                <MapPin size={14} /> {tool.distanceKm} km away
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
 
export default BrowseTools;