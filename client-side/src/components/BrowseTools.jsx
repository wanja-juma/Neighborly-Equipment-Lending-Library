import { Link } from 'react-router-dom';
import tools from '../data/tools';
import './BrowseTools.css';

function BrowseTools() {
  return (
    <section className="browse-tools">
      <h2>Browse Tools</h2>
      <div className="tool-grid">
        {tools.map((tool) => (
          <Link to={`/tools/${tool.id}`} key={tool.id} className="tool-card">
            <h3>{tool.name}</h3>
            <p>{tool.condition}</p>
            <p className="tool-rate">${tool.dailyRate}/day</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default BrowseTools;