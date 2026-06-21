'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useTrips } from '../../../context/TripContext';
import ItineraryEditor from '../../../components/ItineraryEditor';
import PackingList from '../../../components/PackingList';
import RiskScore from '../../../components/RiskScore';
import HotelRecommendations from '../../../components/HotelRecommendations';
import BudgetBreakdown from '../../../components/BudgetBreakdown';
import {
  Map, ArrowLeft, Calendar, DollarSign, Globe, Tag,
  Loader2, AlertCircle, Trash2, LayoutDashboard,
  Package, Hotel, BarChart3, BookOpen, Shield,
} from 'lucide-react';
import Navbar from '../../../components/Navbar';

const TABS = [
  { id: 'itinerary', label: 'Itinerary', icon: BookOpen },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'packing', label: 'Packing', icon: Package },
  { id: 'budget', label: 'Budget', icon: BarChart3 },
  { id: 'risk', label: 'Risk', icon: Shield },
];

const BUDGET_LABELS = { low: 'Budget', medium: 'Mid-Range', high: 'Luxury' };
const BUDGET_COLORS = { low: '#10b981', medium: '#6366f1', high: '#f59e0b' };

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { currentTrip, loading, error, fetchTripById, deleteTrip, updateCurrentTrip, setError } = useTrips();

  const [activeTab, setActiveTab] = useState('itinerary');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch trip
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchTripById(id);
    }
  }, [isAuthenticated, id]); // eslint-disable-line

  const handleDelete = async () => {
    setDeleting(true);
    await deleteTrip(id);
    router.push('/dashboard');
  };

  const handleTripUpdate = (updatedTrip) => {
    updateCurrentTrip(updatedTrip);
  };

  // Auth loading
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <Loader2 size={32} style={{ animation: 'spin-slow 1s linear infinite', color: '#6366f1' }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Trip loading
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative', width: '64px', height: '64px' }}>
            <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin-slow 1s linear infinite' }} />
            <div style={{ position: 'absolute', inset: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Map size={20} color="#6366f1" />
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading trip details...</p>
        </div>
      </div>
    );
  }

  // Error / Not Found
  if (error || !currentTrip) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <AlertCircle size={28} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '10px' }}>Trip Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'This trip does not exist or you do not have access to it.'}</p>
          <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
            <LayoutDashboard size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const trip = currentTrip;
  const budgetColor = BUDGET_COLORS[trip.budgetTier] || '#6366f1';
  const budgetLabel = BUDGET_LABELS[trip.budgetTier] || trip.budgetTier;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ── Navbar ──────────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero Header ─────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)',
        borderBottom: '1px solid rgba(99,102,241,0.15)',
        padding: '40px 0',
      }}>
        <div className="content-container">
          {/* Breadcrumbs & Delete Trip Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>
                <ArrowLeft size={14} />
                Dashboard
              </Link>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>/</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
                Trips
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>/</span>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>
                {trip.destination}
              </span>
            </div>
            <button
              onClick={() => setDeleteConfirm(true)}
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '8px 14px', color: '#f87171', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}
              id="delete-trip-btn"
            >
              <Trash2 size={14} />
              Delete Trip
            </button>
          </div>
          {/* Status badge for generating trips */}
          {trip.status === 'generating' && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px', borderRadius: '999px',
              background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
              fontSize: '12px', color: '#fbbf24', marginBottom: '16px',
            }}>
              <Loader2 size={12} style={{ animation: 'spin-slow 1s linear infinite' }} />
              Generating itinerary...
            </div>
          )}
          {trip.status === 'failed' && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px', borderRadius: '999px',
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              fontSize: '12px', color: '#f87171', marginBottom: '16px',
            }}>
              <AlertCircle size={12} />
              Generation failed — please delete and try again
            </div>
          )}

          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: '900', marginBottom: '16px', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {trip.destination}
            {trip.countryCode && (
              <img
                src={`https://flagcdn.com/w80/${trip.countryCode.toLowerCase()}.png`}
                alt={trip.country || ''}
                style={{ width: '28px', height: '18px', objectFit: 'cover', borderRadius: '3px', border: '1px solid var(--border-color)', flexShrink: 0 }}
                title={trip.country}
              />
            )}
          </h1>

          {/* Meta tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '999px', fontSize: '13px', color: '#818cf8' }}>
              <Calendar size={13} />
              {trip.durationDays} day{trip.durationDays !== 1 ? 's' : ''}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: `${budgetColor}15`, border: `1px solid ${budgetColor}30`, borderRadius: '999px', fontSize: '13px', color: budgetColor }}>
              <DollarSign size={13} />
              {budgetLabel}
            </div>
            {trip.interests?.map(interest => (
              <div key={interest} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '999px', fontSize: '12px', color: '#67e8f9', textTransform: 'capitalize' }}>
                <Tag size={11} />
                {interest}
              </div>
            ))}
          </div>

          {/* Quick summary */}
          {trip.estimatedBudget && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
              {trip.estimatedBudget.total && (
                <span>Est. Total: <strong style={{ color: '#10b981' }}>${trip.estimatedBudget.total.toLocaleString()}</strong></span>
              )}
              {trip.hotels?.length > 0 && (
                <span>{trip.hotels.length} hotel{trip.hotels.length !== 1 ? 's' : ''} recommended</span>
              )}
              {trip.packingList?.length > 0 && (
                <span>{trip.packingList.length} packing items</span>
              )}
              {trip.riskAssessment?.overallScore !== undefined && (
                <span>Risk Score: <strong style={{ color: trip.riskAssessment.overallScore <= 4 ? '#10b981' : trip.riskAssessment.overallScore <= 7 ? '#f59e0b' : '#ef4444' }}>
                  {trip.riskAssessment.overallScore}/10
                </strong></span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Tab Navigation ──────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: '64px', zIndex: 30,
        background: 'rgba(10,10,15,0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99,102,241,0.1)',
      }}>
        <div className="content-container">
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {TABS.map(({ id: tabId, label, icon: Icon }) => (
              <button
                key={tabId}
                id={`tab-${tabId}`}
                onClick={() => setActiveTab(tabId)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '14px 20px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap',
                  color: activeTab === tabId ? '#818cf8' : 'var(--text-muted)',
                  borderBottom: activeTab === tabId ? '2px solid #6366f1' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────── */}
      <div className="content-container" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
        {activeTab === 'itinerary' && (
          <ItineraryEditor
            itinerary={trip.itinerary}
            tripId={trip._id}
            onUpdate={handleTripUpdate}
          />
        )}

        {activeTab === 'hotels' && (
          <HotelRecommendations hotels={trip.hotels || []} />
        )}

        {activeTab === 'packing' && (
          <PackingList
            packingList={trip.packingList}
            tripId={trip._id}
            onUpdate={handleTripUpdate}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetBreakdown
            budget={trip.estimatedBudget}
            durationDays={trip.durationDays}
            budgetTier={trip.budgetTier}
          />
        )}

        {activeTab === 'risk' && (
          <RiskScore riskAssessment={trip.riskAssessment} destination={trip.destination} />
        )}
      </div>

      {/* ── Delete Confirm Modal ────────────────────────────── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        }}>
          <div className="glass" style={{ borderRadius: '20px', padding: '36px', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Trash2 size={26} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Delete &quot;{trip.destination}&quot;?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
              This will permanently delete your {trip.durationDays}-day itinerary, hotel recommendations, packing list, and all trip data. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(false)} className="btn-secondary" disabled={deleting}>
                Cancel
              </button>
              <button
                id="confirm-delete-trip-btn"
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: '12px 24px', background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px',
                  color: '#f87171', cursor: deleting ? 'not-allowed' : 'pointer',
                  fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px',
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} style={{ animation: 'spin-slow 1s linear infinite' }} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
