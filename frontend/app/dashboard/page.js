'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import TripCard from '../../components/TripCard';
import TripGenerateForm from '../../components/TripGenerateForm';
import {
  Sparkles, Map, Plus, Search, Filter, LogOut,
  Globe, Loader2, AlertCircle, LayoutGrid, List,
  TrendingUp, Calendar, Package, X,
} from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function DashboardPage() {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { trips, loading, error, pagination, fetchTrips, generateTrip, deleteTrip, generating, setError } = useTrips();
  const router = useRouter();

  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [search, setSearch] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [generatingMsg, setGeneratingMsg] = useState('');

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch trips on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
    }
  }, [isAuthenticated, fetchTrips]);

  // Search/filter with debounce
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => {
      fetchTrips({ search, budgetTier: budgetFilter });
    }, 400);
    return () => clearTimeout(timer);
  }, [search, budgetFilter]); // eslint-disable-line

  const handleGenerate = async (formData) => {
    setGeneratingMsg('Generating your personalized itinerary with Gemini AI...');
    setShowGenerateForm(false);
    const newTrip = await generateTrip(formData);
    setGeneratingMsg('');
    if (newTrip) {
      router.push(`/trips/${newTrip._id}`);
    }
  };

  const handleDelete = async (id) => {
    await deleteTrip(id);
    setDeleteConfirm(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ── Navbar ───────────────────────────────────── */}
      <Navbar />

      <div className="content-container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {/* ── Header ──────────────────────────────────── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '800', marginBottom: '8px' }}>
                Welcome back, {user?.name?.split(' ')[0] || 'Traveler'} 👋
              </h1>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                {trips.length === 0 ? "Plan your first AI-powered adventure below." : `You have ${trips.length} trip${trips.length !== 1 ? 's' : ''} planned.`}
              </p>
            </div>
            <button
              id="create-trip-btn"
              className="btn-primary"
              onClick={() => setShowGenerateForm(true)}
              style={{ whiteSpace: 'nowrap' }}
            >
              <Plus size={16} />
              New Trip
              <Sparkles size={14} />
            </button>
          </div>

          {/* Stats Row */}
          {trips.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '28px' }}>
              {[
                { icon: Globe, label: 'Total Trips', value: pagination?.total ?? trips.length, color: '#6366f1' },
                { icon: Calendar, label: 'Total Days', value: trips.reduce((sum, t) => sum + (t.durationDays || 0), 0), color: '#8b5cf6' },
                { icon: TrendingUp, label: 'Avg Duration', value: trips.length ? `${Math.round(trips.reduce((s, t) => s + (t.durationDays || 0), 0) / trips.length)}d` : '—', color: '#06b6d4' },
                { icon: Package, label: 'Destinations', value: new Set(trips.map(t => t.destination)).size, color: '#10b981' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.2 }}>{value}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Generating Overlay ───────────────────────── */}
        {(generating || generatingMsg) && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ textAlign: 'center', padding: '48px', background: 'var(--bg-card)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '24px', maxWidth: '400px' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 24px' }}>
                <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin-slow 1s linear infinite' }} />
                <div style={{ position: 'absolute', inset: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={28} color="#6366f1" />
                </div>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Generating Your Trip</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                {generatingMsg || 'Gemini AI is crafting your personalized itinerary, hotel picks, packing list, and risk assessment...'}
              </p>
              <div style={{ marginTop: '20px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Generate Form Modal ──────────────────────── */}
        {showGenerateForm && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          }}>
            <div style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px' }}>
              <TripGenerateForm
                onSubmit={handleGenerate}
                onCancel={() => setShowGenerateForm(false)}
                loading={generating}
              />
            </div>
          </div>
        )}

        {/* ── Search & Filter ──────────────────────────── */}
        {trips.length > 0 || search || budgetFilter ? (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="trip-search"
                className="form-input"
                type="text"
                placeholder="Search destinations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '42px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={14} color="var(--text-muted)" />
              <select
                id="budget-filter"
                className="form-input"
                value={budgetFilter}
                onChange={e => setBudgetFilter(e.target.value)}
                style={{ minWidth: '140px', color:'blue'}}
              >
                <option value="">All Budgets</option>
                <option value="low">Budget</option>
                <option value="medium">Mid-Range</option>
                <option value="high">Luxury</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '4px' }}>
              <button onClick={() => setViewMode('grid')} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: viewMode === 'grid' ? 'rgba(99,102,241,0.3)' : 'transparent', color: viewMode === 'grid' ? '#818cf8' : 'var(--text-muted)', cursor: 'pointer' }}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode('list')} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: viewMode === 'list' ? 'rgba(99,102,241,0.3)' : 'transparent', color: viewMode === 'list' ? '#818cf8' : 'var(--text-muted)', cursor: 'pointer' }}>
                <List size={16} />
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Error State ──────────────────────────────── */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              {error}
            </div>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* ── Loading State ────────────────────────────── */}
        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card"
                style={{ height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0.7 }}
              >
                <div>
                  <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '12px' }} />
                  <div className="skeleton" style={{ height: '16px', width: '30%', marginBottom: '20px' }} />
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div className="skeleton" style={{ height: '16px', width: '20%' }} />
                    <div className="skeleton" style={{ height: '16px', width: '25%' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="skeleton" style={{ height: '20px', width: '40px', borderRadius: '10px' }} />
                    <div className="skeleton" style={{ height: '20px', width: '50px', borderRadius: '10px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <div className="skeleton" style={{ height: '36px', flex: 1, borderRadius: '12px' }} />
                  <div className="skeleton" style={{ height: '36px', width: '44px', borderRadius: '8px' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty State ──────────────────────────────── */}
        {!loading && trips.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Globe size={36} color="#6366f1" />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>No trips yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              {search || budgetFilter
                ? 'No trips match your filters. Try a different search.'
                : 'Ready for your next adventure? Generate your first AI-powered itinerary in seconds.'}
            </p>
            {!search && !budgetFilter && (
              <button className="btn-primary" onClick={() => setShowGenerateForm(true)} id="empty-create-btn">
                <Plus size={16} />
                Plan My First Trip
                <Sparkles size={14} />
              </button>
            )}
          </div>
        )}

        {/* ── Trips Grid / List ────────────────────────── */}
        {!loading && trips.length > 0 && (
          <>
            <div style={{
              display: viewMode === 'grid'
                ? 'grid'
                : 'flex',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : undefined,
              flexDirection: viewMode === 'list' ? 'column' : undefined,
              gap: '20px',
            }}>
              {trips.map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onDelete={(id) => setDeleteConfirm(id)}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => fetchTrips({ search, budgetTier: budgetFilter, page: p })}
                    style={{
                      width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                      background: pagination.page === p ? '#6366f1' : 'var(--bg-card)',
                      color: pagination.page === p ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer', fontWeight: '600', fontSize: '14px',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Delete Confirm Modal ─────────────────────── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        }}>
          <div className="glass" style={{ borderRadius: '20px', padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <AlertCircle size={24} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Delete Trip?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              This action cannot be undone. Your itinerary, packing list, and all trip data will be permanently deleted.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                onClick={() => handleDelete(deleteConfirm)}
                style={{ padding: '10px 24px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#f87171', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
