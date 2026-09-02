
import { House, Calendar, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import heroPhoto from "../assets/hero-photo.jpg";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section className="home">
        <div
          className="home__blob home__blob--green"
          aria-hidden="true"
        />

        <div
          className="home__blob home__blob--amber"
          aria-hidden="true"
        />

        <div className="home__left">
          <div className="home__logo">
            <House
              color="#1E5E3D"
              size={28}
            />

            <div>
              <span className="home__logo-name">
                Neighborly
              </span>

              <span className="home__logo-tagline">
                Borrow. Share. Build Community.
              </span>
            </div>
          </div>

          <h1 className="home__headline">
            Borrow what you need.
            <br />
            <span className="home__accent">
              Share
            </span>{" "}
            what you have{" "}
            <Sparkles
              className="home__sparkle"
              size={22}
              aria-hidden="true"
            />
          </h1>

          <div className="home__actions">
            <button
              type="button"
              className="home__btn home__btn--filled"
              onClick={() =>
                navigate("/browse-tools")
              }
            >
              <Calendar size={18} />
              Browse Tools
            </button>

            <button
              type="button"
              className="home__btn home__btn--outline"
              onClick={() =>
                navigate("/items/new")
              }
            >
              <Plus size={18} />
              List Your Tool
            </button>
          </div>

          <div className="home__social-proof">
            <div
              className="home__avatar-stack"
              aria-hidden="true"
            >
              <span
                className="home__avatar"
                style={{
                  backgroundColor: "#1E5E3D",
                }}
              >
                JM
              </span>

              <span
                className="home__avatar"
                style={{
                  backgroundColor: "#B5432B",
                }}
              >
                AK
              </span>

              <span
                className="home__avatar"
                style={{
                  backgroundColor: "#8B8A84",
                }}
              >
                SW
              </span>
            </div>

            <div>
              <p className="home__social-proof-stat">
                500+ neighbors sharing
              </p>

              <p className="home__social-proof-caption">
                Join your street and start
                borrowing today
              </p>
            </div>
          </div>
        </div>

        <div className="home__right">
          <img
            src={heroPhoto}
            alt="A toolbox full of hand tools next to a lawnmower, ready to be borrowed"
            className="home__photo"
          />
        </div>
      </section>

      <section className="home-stats">
        <p className="home-stats__label">
          Trusted by your community
        </p>

        <div className="home-stats__grid">
          <div className="home-stats__item">
            <p className="home-stats__number">
              500+
            </p>
            <p className="home-stats__caption">
              Tools shared
            </p>
          </div>

          <div className="home-stats__item">
            <p className="home-stats__number">
              1,200+
            </p>
            <p className="home-stats__caption">
              Neighbors
            </p>
          </div>

          <div className="home-stats__item">
            <p className="home-stats__number">
              15
            </p>
            <p className="home-stats__caption">
              Estates
            </p>
          </div>

          <div className="home-stats__item">
            <p className="home-stats__number">
              KSh 2M+
            </p>
            <p className="home-stats__caption">
              Saved by borrowing
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;