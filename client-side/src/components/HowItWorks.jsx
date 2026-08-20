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

export default function HowItWorks() 
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
