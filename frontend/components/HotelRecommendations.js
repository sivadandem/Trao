'use client';

import { Star, MapPin, DollarSign } from 'lucide-react';

const categoryStyles = {
  budget: {
    color: '#4ade80',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.2)',
    label: 'Budget',
    icon: '🏨',
  },
  'mid-range': {
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.2)',
    label: 'Mid-Range',
    icon: '🏩',
  },
  premium: {
    color: '#a78bfa',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
    label: 'Premium',
    icon: '🏰',
  },
};

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          fill={star <= Math.round(rating) ? '#fbbf24' : 'transparent'}
          color={star <= Math.round(rating) ? '#fbbf24' : 'var(--text-muted)'}
        />
      ))}
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>
        {rating?.toFixed(1)}
      </span>
    </div>
  );
}

export default function HotelRecommendations({ hotels = [] }) {
  if (!hotels || hotels.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
        No hotel recommendations available
      </div>
    );
  }

  const order = ['budget', 'mid-range', 'premium'];
  const sorted = [...hotels].sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {sorted.map((hotel, i) => {
        const style = categoryStyles[hotel.category] || categoryStyles.budget;
        return (
          <div
            key={hotel._id || i}
            style={{
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: '14px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Category badge */}
            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: style.bg,
                  color: style.color,
                  border: `1px solid ${style.border}`,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {style.icon} {style.label}
              </span>
            </div>

            <div style={{ paddingRight: '90px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {hotel.name}
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                <StarRating rating={hotel.rating} />
                {hotel.pricePerNight > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={12} color={style.color} />
                    <span style={{ fontSize: '13px', color: style.color, fontWeight: '600' }}>
                      ${hotel.pricePerNight}/night
                    </span>
                  </div>
                )}
                {hotel.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="var(--text-muted)" />
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{hotel.location}</span>
                  </div>
                )}
              </div>

              {hotel.reason && (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {hotel.reason}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
