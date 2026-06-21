'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import TripGenerateForm from '../../components/TripGenerateForm';
import TripCard from '../../components/TripCard';
import {
  Map, Plus, Search, Sparkles, ArrowLeft, Globe,
  Loader2, AlertCircle, X, Filter,
} from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function TripsPage() {
  const { isAuthenticated, loading: authLoading, user, logout } = useAuth();
  const { trips, loading, error, pagination, fetchTrips, generateTrip, deleteTrip, generating, setError } = useTrips();
  const router = useRouter();

  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [search, setSearch] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips({ page: currentPage });
    }
  }, [isAuthenticated]); // eslint-disable-line

  // Filter changes
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchTrips({ search, budgetTier: budgetFilter, page: 1 });
    }, 400);
    return () => clearTimeout(timer);
  }, [search, budgetFilter]); // eslint-disable-line

  const handleGenerate = async (formData) => {
    setShowGenerateForm(false);
    const newTrip = await generateTrip(formData);
    if (newTrip) {
      router.push(`/trips/${newTrip._id}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTrips({ search, budgetTier: budgetFilter, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    await deleteTrip(id);
    setDeleteConfirm(null);
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <Loader2 size={32} style={{ animation: 'spin-slow 1s linear infinite', color: '#6366f1' }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ── Navbar ─────────────────────────────────────── */}
      <Navbar />

      <div className="content-container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {/* ── Header ─────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>My Trips</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {pagination?.total ? `${pagination.total} trip${pagination.total !== 1 ? 's' : ''} total` : 'All your planned adventures'}
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowGenerateForm(true)} id="new-trip-btn">
            <Plus size={16} />
            New Trip
            <Sparkles size={14} />
          </button>
        </div>

        {/* ── Generating Overlay ─────────────────────── */}
        {generating && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
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
                Gemini AI is creating your personalized itinerary, hotel recommendations, packing list, and risk assessment...
              </p>
            </div>
          </div>
        )}

        {/* ── Generate Form Modal ─────────────────────── */}
        {showGenerateForm && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
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

        {/* ── Search & Filter ─────────────────────────── */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="trips-search"
              className="form-input"
              type="text"
              placeholder="Search by destination..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '42px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} color="var(--text-muted)" />
            <select
              id="trips-budget-filter"
              className="form-input"
              value={budgetFilter}
              onChange={e => setBudgetFilter(e.target.value)}
              style={{ minWidth: '140px' }}
            >
              <option value="">All Budgets</option>
              <option value="low">Budget</option>
              <option value="medium">Mid-Range</option>
              <option value="high">Luxury</option>
            </select>
          </div>
        </div>

        {/* ── Error ──────────────────────────────────── */}
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

        {/* ── Loading ─────────────────────────────────── */}
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

        {/* ── Empty ───────────────────────────────────── */}
        {!loading && trips.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Globe size={32} color="#6366f1" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>
              {search || budgetFilter ? 'No trips found' : 'No trips yet'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              {search || budgetFilter
                ? 'Try adjusting your search or filters.'
                : 'Create your first AI-powered itinerary now.'}
            </p>
            {!search && !budgetFilter && (
              <button className="btn-primary" onClick={() => setShowGenerateForm(true)}>
                <Plus size={16} /> Plan My First Trip
              </button>
            )}
          </div>
        )}

        {/* ── Trip Grid ───────────────────────────────── */}
        {!loading && trips.length > 0 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {trips.map(trip => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onDelete={id => setDeleteConfirm(id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.2)', background: 'var(--bg-card)', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                >
                  Previous
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: currentPage === p ? '#6366f1' : 'var(--bg-card)', color: currentPage === p ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.2)', background: 'var(--bg-card)', color: currentPage === pagination.pages ? 'var(--text-muted)' : 'var(--text-primary)', cursor: currentPage === pagination.pages ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Delete Confirm ─────────────────────────────── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        }}>
          <div className="glass" style={{ borderRadius: '20px', padding: '32px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <AlertCircle size={24} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Delete this trip?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              This cannot be undone. All trip data will be permanently deleted.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">Cancel</button>
              <button
                id="trips-confirm-delete-btn"
                onClick={() => handleDelete(deleteConfirm)}
                style={{ padding: '10px 20px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#f87171', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
