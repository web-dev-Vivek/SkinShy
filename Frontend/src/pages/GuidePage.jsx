import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Search, Zap, Shield, Eye } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Complete Your Profile',
    desc: 'During onboarding, tell us about your skin type, concerns, and preferences. This helps us recommend products tailored to your needs.',
    sub: 'Your profile information is kept private and secure.',
  },
  {
    num: '02',
    title: 'Browse Products',
    desc: 'Head to the Browse section to explore skincare products matched to your profile. Filter by category, price, and brand.',
    sub: 'Use search to find specific products or ingredients.',
  },
  {
    num: '03',
    title: 'Check Safety Ratings',
    desc: 'Each product displays a safety rating based on ingredient analysis. Check the safety bar to understand potential concerns.',
    sub: 'Read ingredient details to make informed choices.',
  },
  {
    num: '04',
    title: 'Compare Ingredients',
    desc: 'Use the Compare section to view detailed information about skincare ingredients and their effects.',
    sub: 'Learn about benefits, concerns, and which ingredients work best together.',
  },
];

const features = [
  {
    Icon: Search,
    title: 'Smart Product Search',
    desc: 'Find skincare products that match your skin type and concerns. Filter by category, price range, and brand to narrow down options.',
  },
  {
    Icon: Shield,
    title: 'Safety Analysis',
    desc: 'Our AI-powered safety bar analyzes product ingredients to identify potential irritants and concerns based on your skin profile.',
  },
  {
    Icon: Eye,
    title: 'Ingredient Glossary',
    desc: 'Access a comprehensive database of skincare ingredients. Learn about their benefits, potential side effects, and compatibility with different skin types.',
  },
  {
    Icon: Zap,
    title: 'Personalized Recommendations',
    desc: 'Get product suggestions tailored to your specific skin profile. Our algorithm considers your skin type, concerns, and preferences.',
  },
];

const tips = [
  { strong: 'Update Your Profile:', rest: 'Keep your skin information up-to-date for better recommendations as your skin changes.' },
  { strong: 'Read Ingredient Lists:', rest: 'Always check ingredient details to avoid known irritants for your skin.' },
  { strong: 'Patch Test:', rest: 'Test new products on a small area first to ensure compatibility with your skin.' },
  { strong: 'Give Products Time:', rest: 'Most skincare products require 4–6 weeks of consistent use to show results.' },
  { strong: 'Use Filters Wisely:', rest: 'Take advantage of our filtering system to find products that match your needs.' },
];

const faqs = [
  {
    q: 'How accurate is the safety rating?',
    a: 'Our safety ratings are based on comprehensive ingredient analysis and scientific research. However, individual skin reactions can vary. Always patch test new products and consult a dermatologist if you have specific concerns.',
  },
  {
    q: 'Can I edit my profile after onboarding?',
    a: 'Yes! You can update your profile at any time from your Profile page. Changes will immediately reflect in your product recommendations.',
  },
  {
    q: 'How do I find products within my budget?',
    a: 'Use the price filter on the Browse page to show only products within your desired price range. This helps you find suitable options without exceeding your budget.',
  },
  {
    q: 'What do the safety bar colors mean?',
    a: 'Green indicates a safe product for your skin type, yellow indicates some caution-worthy ingredients, and red indicates potential concerns. Always read the details for more information.',
  },
  {
    q: 'Is my personal data secure?',
    a: 'Absolutely. Your personal data and skin profile are encrypted and protected with industry-standard security measures. We never share your information with third parties.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-custom-charcoal/20 rounded-xl overflow-hidden bg-custom-white transition-all duration-300">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group hover:bg-custom-off-white transition-colors duration-200"
      >
        <span className="text-base md:text-lg font-semibold text-custom-charcoal group-hover:text-custom-black transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 text-custom-charcoal transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-custom-dark-gray border-t border-custom-light-gray pt-4 leading-relaxed text-sm">
          {a}
        </div>
      )}
    </div>
  );
}

function GuidePage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-custom-off-white to-custom-light-gray">

      {/* ── Hero Header ── */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <div
          className="rounded-2xl px-10 py-14 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #333333 0%, #000000 100%)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.20)',
          }}
        >
          {/* Decorative rings */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border border-white/10 pointer-events-none" />

          <p className="text-white/40 uppercase tracking-widest text-xs font-lato mb-4">User Guide</p>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-5 leading-tight">
            How to Use Skinshy
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed">
            Welcome to Skinshy! Learn how to discover skincare products that work best for your skin type and concerns.
          </p>
        </div>
      </div>

      {/* ── Getting Started ── */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-custom-charcoal mb-10 flex items-center gap-3">
          <span className="block w-8 h-0.5 bg-custom-charcoal rounded-full" />
          Getting Started
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map(({ num, title, desc, sub }) => (
            <div
              key={num}
              className="rounded-xl p-7 bg-custom-white border border-custom-charcoal/10 hover:border-custom-charcoal/40 hover:shadow-xl transition-all duration-300 group"
            >
              <div
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg mb-5 bg-custom-charcoal text-white font-bold text-sm font-lato group-hover:scale-110 transition-transform duration-300"
              >
                {num}
              </div>
              <h3 className="text-lg font-semibold text-custom-charcoal mb-2">{title}</h3>
              <p className="text-custom-dark-gray mb-4 leading-relaxed text-sm">{desc}</p>
              <p className="text-xs text-custom-medium-gray border-t border-custom-light-gray pt-3">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Key Features ── */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-custom-charcoal mb-10 flex items-center gap-3">
          <span className="block w-8 h-0.5 bg-custom-charcoal rounded-full" />
          Key Features
        </h2>

        <div className="space-y-4">
          {features.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-5 rounded-xl px-7 py-6 bg-custom-white border border-custom-charcoal/10 hover:border-custom-charcoal/40 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-custom-charcoal group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-custom-charcoal mb-1">{title}</h3>
                <p className="text-custom-dark-gray text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tips & Best Practices ── */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-custom-charcoal mb-10 flex items-center gap-3">
          <span className="block w-8 h-0.5 bg-custom-charcoal rounded-full" />
          Tips &amp; Best Practices
        </h2>

        <div
          className="rounded-2xl px-8 py-8 border border-custom-charcoal/20"
          style={{ background: 'linear-gradient(135deg, #333333 0%, #000000 100%)' }}
        >
          <ul className="space-y-5">
            {tips.map(({ strong, rest }) => (
              <li key={strong} className="flex gap-4 items-start">
                <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0 mt-1" />
                <span className="text-white/75 text-sm leading-relaxed">
                  <strong className="text-white font-semibold">{strong}</strong>{' '}{rest}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-custom-charcoal mb-10 flex items-center gap-3">
          <span className="block w-8 h-0.5 bg-custom-charcoal rounded-full" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map(faq => <FAQItem key={faq.q} {...faq} />)}
        </div>
      </div>

    </div>
  );
}

export default GuidePage;


