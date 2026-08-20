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
            className={`hiw-tab-btn ${activeTab === 'share' ? 'active' : ''}`}
          >
            For Tool Owners
          </button>
        </div>
      </div>
    </section>
  );
}