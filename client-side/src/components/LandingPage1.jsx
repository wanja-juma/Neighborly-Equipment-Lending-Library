import React, { useState } from 'react';
import heroPhoto from '../assets/hero-photo.jpg';
import './LandingPage1.css';
import './LandingPage.css';
import { 
  House, 
  Calendar, 
  Plus, 
  Sparkles,
  Search, 
  Handshake, 
  PlusCircle, 
  ShieldCheck,
  ChevronDown,
  DollarSign,
  Users,
  Leaf
} from 'lucide-react';

export default function LandingPage1() {
  const [activeTab, setActiveTab] = useState('borrow');
  const [faqOpen, setFaqOpen] = useState(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 4000);
  };

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

          <div className="home__social-proof">
            <div className="home__avatar-stack" aria-hidden="true">
              <span className="home__avatar" style={{ backgroundColor: '#1E5E3D' }}>JM</span>
              <span className="home__avatar" style={{ backgroundColor: '#B5432B' }}>AK</span>
              <span className="home__avatar" style={{ backgroundColor: '#8B8A84' }}>SW</span>
            </div>
            <div>
              <p className="home__social-proof-stat">500+ neighbors sharing</p>
              <p className="home__social-proof-caption">
                Join your street and start borrowing today
              </p>
            </div>
          </div>
        </div>

        <div className="home__right">
          <img
            src={heroPhoto}
            alt="A wall unit with tools and a hand reaching out to pick one , ready to be borrowed"
            className="home__photo"
          />
        </div>
      </section>

      <section className="home-stats">
        <p className="home-stats__label">Trusted by your community</p>
        <div className="home-stats__grid">
          <div className="home-stats__item">
            <p className="home-stats__number">500+</p>
            <p className="home-stats__caption">Tools shared</p>
          </div>
          <div className="home-stats__item">
            <p className="home-stats__number">1,200+</p>
            <p className="home-stats__caption">Neighbors</p>
          </div>
          <div className="home-stats__item">
            <p className="home-stats__number">15</p>
            <p className="home-stats__caption">Estates</p>
          </div>
          <div className="home-stats__item">
            <p className="home-stats__number">KSh 2M+</p>
            <p className="home-stats__caption">Saved by borrowing</p>
          </div>
        </div>

        <div className="container">
          <section className="hero">
            <h1 className="title">
              How <span className="brand-color">Neighborly</span> Works
            </h1>
            <p className="subtitle">
              Neighbourly is a website used to hire tools and equipments where one
              borrow tools you need for quick fixes, or share your own equipment to earn extra income and support your local community.
            </p>

            <div className="tab-wrapper">
              <div className="tab-container">
                <button
                  onClick={() => setActiveTab('borrow')}
                  className={`tab-btn ${activeTab === 'borrow' ? 'active' : ''}`}
                >
                  For Borrowers
                </button>
                <button
                  onClick={() => setActiveTab('share')}
                  className={`tab-btn ${activeTab === 'share' ? 'active' : ''}`}
                >
                  For Tool Owners
                </button>
              </div>
            </div>
          </section>

          <section className="section">
            {activeTab === 'borrow' ? (
              <div className="grid">
                <div className="card">
                  <span className="step-number">1</span>
                  <div className="icon-box">
                    <Search className="w-7 h-7" />
                  </div>
                  <h3 className="card-title">Find Tools Nearby</h3>
                  <p className="card-desc">
                    Search for drills, ladders, mowers, or power washers listed by verified neighbors within your neighborhood radius.
                  </p>
                </div>

                <div className="card">
                  <span className="step-number">2</span>
                  <div className="icon-box">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h3 className="card-title">Send a Request</h3>
                  <p className="card-desc">
                    Select your required dates, review transparent daily rates in KSh, and send a booking request to the tool owner.
                  </p>
                </div>

                <div className="card">
                  <span className="step-number">3</span>
                  <div className="icon-box">
                    <Handshake className="w-7 h-7" />
                  </div>
                  <h3 className="card-title">Pick Up & Return</h3>
                  <p className="card-desc">
                    Arrange a quick meetup with your neighbor, complete your task, and return the item clean and on schedule.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid">
                <div className="card">
                  <span className="step-number">1</span>
                  <div className="icon-box">
                    <PlusCircle className="w-7 h-7" />
                  </div>
                  <h3 className="card-title">List Your Equipment</h3>
                  <p className="card-desc">
                    Snap photos of your idle tools, add a quick description, set your daily price in KSh, and set availability.
                  </p>
                </div>

                <div className="card">
                  <span className="step-number">2</span>
                  <div className="icon-box">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="card-title">Approve Borrowers</h3>
                  <p className="card-desc">
                    Review request dates and borrower profiles. You retain complete control over who borrows your tools.
                  </p>
                </div>

                <div className="card">
                  <span className="step-number">3</span>
                  <div className="icon-box">
                    <DollarSign className="w-7 h-7" />
                  </div>
                  <h3 className="card-title">Earn & Help</h3>
                  <p className="card-desc">
                    Hand off the equipment locally and receive direct earnings while helping neighbors complete home projects.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="section">
            <div className="banner">
              <div className="banner-item">
                <div className="banner-icon"><DollarSign className="w-6 h-6" /></div>
                <h4 className="font-bold text-base">Save & Earn</h4>
                <p className="banner-desc">Why buy expensive tools when you can borrow or monetize idle equipment?</p>
              </div>
              <div className="banner-item">
                <div className="banner-icon"><Users className="w-6 h-6" /></div>
                <h4 className="font-bold text-base">Build Community</h4>
                <p className="banner-desc">Connect with verified people living right down your street.</p>
              </div>
              <div className="banner-item">
                <div className="banner-icon"><ShieldCheck className="w-6 h-6" /></div>
                <h4 className="font-bold text-base">Safe & Secure</h4>
                <p className="banner-desc">Identity checks, clear agreements, and trusted user reviews.</p>
              </div>
              <div className="banner-item">
                <div className="banner-icon"><Leaf className="w-6 h-6" /></div>
                <h4 className="font-bold text-base">Reduce Waste</h4>
                <p className="banner-desc">Promote sustainable eco-friendly living through shared usage.</p>
              </div>
            </div>
          </section>

          <section className="faq-section">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
              <p className="text-slate-600 text-sm mt-1">Quick answers to common questions about sharing and borrowing.</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: "What happens if a tool is damaged during borrowing?",
                  a: "Borrowers are expected to cover repairs or replacement costs for damaged items. Neighborly offers community guidelines and optional coverage for peace of mind."
                },
                {
                  q: "How are payments handled?",
                  a: "Payments are processed securely via local payment channels (e.g., M-Pesa / cards) upon approval of the borrowing request."
                },
                {
                  q: "How do you verify identity?",
                  a: "All active members verify their phone numbers and government IDs before borrowing or listing equipment."
                }
              ].map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="faq-btn"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${faqOpen === idx ? 'transform rotate-180' : ''}`} />
                  </button>
                  {faqOpen === idx && (
                    <div className="faq-answer">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}