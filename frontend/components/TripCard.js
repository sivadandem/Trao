'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Trash2, Eye, DollarSign } from 'lucide-react';
import { getBudgetBadge, formatDate, formatCurrency, interestEmojis } from '../lib/utils';

export default function TripCard({ trip, onDelete }) {
  const router = useRouter();

  const budgetBadge = getBudgetBadge(trip.budgetTier);

  return (
    <div
      className="card"
      style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
      role="article"
      aria-label={`Trip to ${trip.destination}`}
    >
      {/* Top gradient accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '16px',
          marginTop: '4px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <MapPin size={16} color="#6366f1" />
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {trip.destination}
              {trip.countryCode && (
                <img
                  src={`https://flagcdn.com/w40/${trip.countryCode.toLowerCase()}.png`}
                  alt={trip.country || ''}
                  style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }}
                  title={trip.country}
                />
              )}
            </h3>
          </div>
          <span className={`badge ${budgetBadge.className}`}>{budgetBadge.label}</span>
        </div>

        {/* Status indicator */}
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: trip.status === 'completed' ? '#4ade80' : trip.status === 'failed' ? '#f87171' : '#fbbf24',
            boxShadow: `0 0 8px ${trip.status === 'completed' ? '#4ade80' : trip.status === 'failed' ? '#f87171' : '#fbbf24'}`,
            flexShrink: 0,
            marginTop: '4px',
          }}
          title={trip.status}
        />
      </div>

      {/* Meta info */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {trip.durationDays} {trip.durationDays === 1 ? 'day' : 'days'}
          </span>
        </div>

        {trip.estimatedBudget?.total > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {formatCurrency(trip.estimatedBudget.total, trip.estimatedBudget.currency)}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {formatDate(trip.createdAt)}
          </span>
        </div>
      </div>

      {/* Interests */}
      {trip.interests && trip.interests.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {trip.interests.slice(0, 4).map((interest) => (
            <span
              key={interest}
              style={{
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: '999px',
                background: 'rgba(99,102,241,0.1)',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              {interestEmojis[interest]} {interest}
            </span>
          ))}
          {trip.interests.length > 4 && (
            <span
              style={{
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: '999px',
                background: 'rgba(99,102,241,0.05)',
                color: 'var(--text-muted)',
              }}
            >
              +{trip.interests.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link
          href={`/trips/${trip._id}`}
          className="btn-primary"
          style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', padding: '10px 16px', fontSize: '13px' }}
          aria-label={`View trip to ${trip.destination}`}
        >
          <Eye size={14} />
          View Details
        </Link>
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(trip._id);
            }}
            className="btn-danger"
            style={{ padding: '10px 14px' }}
            aria-label={`Delete trip to ${trip.destination}`}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
