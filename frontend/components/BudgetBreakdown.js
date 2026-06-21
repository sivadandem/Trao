'use client';

import { DollarSign, Plane, Building, Utensils, MapPin, Car } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

const budgetItems = [
  { key: 'flights', label: 'Flights', icon: Plane, color: '#6366f1' },
  { key: 'accommodation', label: 'Accommodation', icon: Building, color: '#8b5cf6' },
  { key: 'food', label: 'Food & Dining', icon: Utensils, color: '#ec4899' },
  { key: 'activities', label: 'Activities', icon: MapPin, color: '#06b6d4' },
  { key: 'transport', label: 'Local Transport', icon: Car, color: '#10b981' },
];

export default function BudgetBreakdown({ budget }) {
  if (!budget || !budget.total) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
        Budget breakdown not available
      </div>
    );
  }

  const currency = budget.currency || 'USD';

  return (
    <div>
      {/* Total */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '14px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Estimated Total
        </div>
        <div
          style={{
            fontSize: '36px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {formatCurrency(budget.total, currency)}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          {currency} · All-inclusive estimate
        </div>
      </div>

      {/* Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {budgetItems.map(({ key, label, icon: Icon, color }) => {
          const amount = budget[key] || 0;
          const pct = budget.total > 0 ? Math.round((amount / budget.total) * 100) : 0;

          return (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: `${color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} color={color} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{label}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color }}>
                    {formatCurrency(amount, currency)}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(135deg, ${color}88, ${color})`,
                    }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {pct}% of total budget
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
