import  { useState } from 'react';
import './About.css';
import { 
  Calendar, 
  Search, 
  Handshake, 
  PlusCircle, 
  ShieldCheck,
  ChevronDown,
  DollarSign,
  Users,
  Leaf,
  Star,
  Quote
} from 'lucide-react';

export default function LandingPage1() {
  const [activeTab, setActiveTab] = useState('borrow');
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const testimonials = [
    {
      name: "David K.",
      role: "Homeowner in Kilimani",
      image: "DK",
      bgColor: "#1E5E3D",
      rating: 5,
      text: "Saved over KSh 15,000 borrowing a pressure washer and lawn mower instead of buying. Pickup took 5 minutes!"
    },
    {
      name: "Amina M.",
      role: "Tool Owner in Westlands",
      image: "AM",
      bgColor: "#B5432B",
      rating: 5,
      text: "My power tools were sitting in the garage gathering dust. Now I cover my weekly groceries just sharing them."
    },
    {
      name: "Sammy O.",
      role: "DIY Enthusiast in Lavington",
      image: "SO",
      bgColor: "#8B8A84",
      rating: 5,
      text: "Great community! The identity check gives total peace of mind when giving out expensive drills and saws."
    }
  ];

  return (
    <div className="container" id="about">
      <section className="hero">
        <h1 className="title">
          How <span className="brand-color">Neighborly</span> Works
        </h1>
        <p className="subtitle">
          Neighbourly is a website used to hire tools and equipment where one
          can borrow tools you need for quick fixes, or share your own equipment to earn extra income and support your local community.
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

      <section className="section">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">What Our Neighbors Say</h2>
          <p className="text-slate-600 text-sm mt-1">Real stories from community members near you.</p>
        </div>

        <div className="grid">
          {testimonials.map((item, index) => (
            <div key={index} className="card" style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#EAB308" color="#EAB308" />
                  ))}
                </div>
                <Quote size={20} className="text-slate-300" />
              </div>
              <p className="card-desc" style={{ fontStyle: 'italic', marginBottom: '16px' }}>
                "{item.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="home__avatar" style={{ backgroundColor: item.bgColor }}>
                  {item.image}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
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
  );
}