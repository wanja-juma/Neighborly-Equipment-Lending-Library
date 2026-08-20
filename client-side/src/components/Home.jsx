import { useState } from 'react';
import { House, Search, MapPin, Calendar, Plus } from 'lucide-react';
import heroPhoto from '../assets/hero-photo.jpg';
import './Home.css';

function Home() {
  const [query, setQuery] = useState('');

  function handleSearch(event) {
    event.preventDefault();
    // TODO: wire this up once the item-search endpoint exists
    console.log('Searching for:', query);
  }

  return (
    <section className="home">
      <div className="home__left">
        <div className="home__logo">
          <House color="#1E5E3D" size={30} />
          <div className="home__logo-text">
            <span className="home__logo-name">Neighborly</span>
            <span className="home__logo-tagline">
              Borrow. Share. Build Community.
            </span>
          </div>
        </div>

        <h1 className="home__headline">
          <span className="home__accent">Borrow</span> what you need.
          <br />
          <span className="home__accent">Share</span> what you have.
        </h1>

        <form className="home__search" onSubmit={handleSearch}>
          <span className="home__search-icon" aria-hidden="true">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="home__search-input"
            placeholder="Search tools (drill, ladder, mower)…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search for equipment"
          />
          <button type="submit" className="home__search-button">
            Search
          </button>
        </form>

        <div className="home__actions">
          <button type="button" className="home__btn home__btn--filled">
            <Calendar size={18} />
            Browse Tools
          </button>
          <button type="button" className="home__btn home__btn--outline">
            <Plus size={18} />
            List Your Tool
          </button>
        </div>

        <p className="home__trust">
          <MapPin size={14} />
          Trusted by your community. Right here, right now.
        </p>
      </div>

      <div className="home__right">
        <img
          src={heroPhoto}
          alt="A toolbox full of hand tools next to a lawnmower, ready to be borrowed"
          className="home__photo"
        />
      </div>
    </section>
  );
}

export default Home;