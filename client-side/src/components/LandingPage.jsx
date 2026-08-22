import { House, Calendar, Plus, Sparkles } from 'lucide-react';
import heroPhoto from '../assets/hero-photo.jpg';
import './Home.css';
 
function Home() {
  return (
    <>
      <section className="home">
        <div className="home__blob home__blob--green" aria-hidden="true" />
        <div className="home__blob home__blob--amber" aria-hidden="true" />
 
        <div className="home__left">
          <div className="home__logo">
            <House color="#1E5E3D" size={28} />
            <div>
              <span className="home__logo-name">Neighborly</span>
              <span className="home__logo-tagline">
                Borrow. Share. Build Community.
              </span>
            </div>
          </div>
 
          <h1 className="home__headline">
            Borrow what you need.
            <br />
            <span className="home__accent">Share</span> what you have{' '}
            <Sparkles className="home__sparkle" size={22} aria-hidden="true" />
          </h1>

          
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
 
        </div>
      </section>
    </>
  );
}