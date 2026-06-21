'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Sparkles, Map, Shield, Zap, Star, ArrowRight, CheckCircle,
  Globe, Calendar, Package, AlertTriangle, Hotel
} from 'lucide-react';
import Navbar from '../components/Navbar';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Itineraries',
    desc: 'Gemini 2.5 Flash generates personalized day-by-day plans tailored to your interests and budget.',
    color: '#6366f1',
  },
  {
    icon: Hotel,
    title: 'Hotel Recommendations',
    desc: 'Get curated budget, mid-range, and luxury hotel picks for every destination.',
    color: '#8b5cf6',
  },
  {
    icon: Package,
    title: 'Smart Packing Assistant',
    desc: 'Weather-aware packing checklists with categories you can check off as you pack.',
    color: '#06b6d4',
  },
  {
    icon: AlertTriangle,
    title: 'Trip Risk Score',
    desc: 'AI-generated risk assessments covering weather, crowds, budget, and travel difficulty.',
    color: '#f59e0b',
  },
  {
    icon: Calendar,
    title: 'Editable Itinerary',
    desc: 'Add, edit, or remove activities. Regenerate any day with custom AI instructions.',
    color: '#10b981',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your trips are yours. JWT auth + data isolation ensures complete privacy.',
    color: '#ec4899',
  },
];

const steps = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up in seconds with just your email and password.' },
  { num: '02', title: 'Enter Trip Details', desc: 'Choose destination, duration, budget, and interests.' },
  { num: '03', title: 'AI Generates Everything', desc: 'Gemini crafts your complete itinerary, hotels, and packing list.' },
  { num: '04', title: 'Customize & Go', desc: 'Edit any detail, check off packing items, and explore the world!' },
];

const testimonials = [
  { name: 'Sarah K.', role: 'Digital Nomad', text: 'Trao planned my 2-week Japan trip in under a minute. The itinerary was spot-on!', rating: 5 },
  { name: 'Marcus R.', role: 'Family Traveler', text: 'The packing list and risk score features saved us from so many headaches.', rating: 5 },
  { name: 'Priya L.', role: 'Adventure Seeker', text: 'I regenerated Day 3 to be more outdoor-focused. So smart!', rating: 5 },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="page-container">
      {/* ─── Navigation ─────────────────────────────────────────── */}
      <Navbar />

      {/* ─── Hero ────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: '160px',
          paddingBottom: '120px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -60%)',
            width: '800px',
            height: '600px',
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        <div className="content-container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)',
              marginBottom: '28px',
              fontSize: '13px',
              color: '#818cf8',
              fontWeight: '500',
            }}
          >
            <Zap size={13} fill="#818cf8" />
            Powered by Google Gemini 2.5 Flash
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: '900',
              lineHeight: '1.1',
              marginBottom: '24px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Plan Your Perfect Trip
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              with the Power of AI
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto 48px',
              lineHeight: '1.7',
            }}
          >
            Generate personalized day-by-day itineraries, hotel recommendations, smart packing lists,
            and trip risk assessments — all powered by AI in seconds.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/register"
              className="btn-primary"
              style={{ textDecoration: 'none', padding: '16px 36px', fontSize: '16px' }}
              id="hero-get-started"
            >
              <Sparkles size={18} />
              Start Planning Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="btn-secondary"
              style={{ textDecoration: 'none', padding: '16px 36px', fontSize: '16px' }}
            >
              Sign In
            </Link>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '40px',
            }}
          >
            {['No credit card needed', 'AI-powered', 'Multi-user secure'].map((text) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <CheckCircle size={14} color="#4ade80" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ───────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderTop: '1px solid rgba(99,102,241,0.1)', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
        <div className="content-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '32px', textAlign: 'center' }}>
            {[
              { value: '10s', label: 'Average generation time' },
              { value: '30+', label: 'Destinations supported' },
              { value: '8', label: 'Interest categories' },
              { value: '100%', label: 'Data isolated per user' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="stat-number">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 0' }}>
        <div className="content-container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', marginBottom: '16px' }}>
              Everything You Need to{' '}
              <span className="gradient-text">Travel Smarter</span>
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
              From AI itineraries to risk assessments — Trao handles it all.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card" style={{ borderColor: `${color}20` }}>
                <div
                  style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: `${color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 0', background: 'rgba(99,102,241,0.03)' }}>
        <div className="content-container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', marginBottom: '16px' }}>
              From Idea to Itinerary in{' '}
              <span className="gradient-text">4 Simple Steps</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {steps.map(({ num, title, desc }) => (
              <div key={num} style={{ textAlign: 'center', padding: '32px 24px' }}>
                <div
                  style={{
                    fontSize: '48px', fontWeight: '900',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: '1',
                    marginBottom: '16px',
                  }}
                >
                  {num}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────── */}
      <section style={{ padding: '100px 0' }}>
        <div className="content-container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', marginBottom: '16px' }}>
              Travelers{' '}
              <span className="gradient-text">Love Trao</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {testimonials.map(({ name, role, text, rating }) => (
              <div key={name} className="card">
                <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '16px', fontStyle: 'italic' }}>
                  "{text}"
                </p>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 0' }}>
        <div className="content-container">
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '24px',
              padding: 'clamp(40px, 6vw, 80px)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute', top: '-50%', left: '-10%',
                width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent 60%)',
              }}
            />
            <Globe size={48} color="#6366f1" style={{ margin: '0 auto 24px', display: 'block', animation: 'float 3s ease-in-out infinite' }} />
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', marginBottom: '16px' }}>
              Ready to Plan Your Next Adventure?
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
              Join thousands of travelers using AI to plan smarter, pack better, and travel with confidence.
            </p>
            <Link
              href="/register"
              className="btn-primary"
              style={{ textDecoration: 'none', padding: '18px 48px', fontSize: '17px' }}
              id="cta-get-started"
            >
              <Sparkles size={20} />
              Start Planning Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(99,102,241,0.1)',
          padding: '40px 0',
          textAlign: 'center',
        }}
      >
        <div className="content-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Map size={14} color="white" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-secondary)' }}>Trao</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            © 2024 Trao AI Travel Planner. Built with ❤️ and Google Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
}
