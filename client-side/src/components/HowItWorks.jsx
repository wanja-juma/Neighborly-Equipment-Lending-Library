import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Handshake, 
  PlusCircle, 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  HelpCircle,
  ChevronDown,
  DollarSign,
  Users,
  Leaf
} from 'lucide-react';

export default function HowItWorks() {
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
    <div className="container">
      
       
      <section className="hero">
        
        <h1 className="title">
          How <span className="brand-color">Neighborly</span> Works
        </h1>
        <p className="subtitle">
            Neighbourly is a website used to hire tools and equipments where one
          borrow tools you need for quick fixes, or share your own equipment to earn extra income and support your local community.
        </p>

        {/* TAB TOGGLE */}
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


      
    