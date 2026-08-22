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
}