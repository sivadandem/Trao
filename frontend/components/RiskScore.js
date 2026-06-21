'use client';

import { AlertTriangle, CloudRain, Navigation, Users, Wallet, Info } from 'lucide-react';
import { getRiskLevel } from '../lib/utils';

function RiskMeter({ label, score, icon: Icon }) {
  const { label: riskLabel, color } = getRiskLevel(score);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px',
        padding: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon size={14} color={color} />
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color }}>{score}/100</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({riskLabel})</span>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${score}%`,
            background: `linear-gradient(135deg, ${color}88, ${color})`,
          }}
        />
      </div>
    </div>
  );
}

export default function RiskScore({ riskAssessment }) {
  if (!riskAssessment) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
        Risk assessment not available
      </div>
    );
  }

  const overall = getRiskLevel(riskAssessment.overallScore || 0);

  return (
    <div>
      {/* Overall Score Hero */}
      <div
        style={{
          background: `radial-gradient(circle at center, ${overall.color}15, transparent)`,
          border: `1px solid ${overall.color}30`,
          borderRadius: '16px',
          padding: '28px',
          textAlign: 'center',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `conic-gradient(${overall.color} ${riskAssessment.overallScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 30px ${overall.color}30`,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '62px',
              height: '62px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontSize: '22px', fontWeight: '800', color: overall.color, lineHeight: '1' }}>
              {riskAssessment.overallScore}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/100</span>
          </div>
        </div>

        <div style={{ fontSize: '18px', fontWeight: '700', color: overall.color, marginBottom: '8px' }}>
          {overall.label}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
          {riskAssessment.explanation}
        </div>
      </div>

      {/* Risk Breakdown */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Risk Breakdown
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <RiskMeter label="Weather Risk" score={riskAssessment.weatherRisk || 0} icon={CloudRain} />
          <RiskMeter label="Travel Difficulty" score={riskAssessment.travelDifficulty || 0} icon={Navigation} />
          <RiskMeter label="Crowd Level" score={riskAssessment.crowdLevel || 0} icon={Users} />
          <RiskMeter label="Budget Risk" score={riskAssessment.budgetRisk || 0} icon={Wallet} />
        </div>
      </div>

      {/* Travel Tips */}
      {riskAssessment.travelTips && riskAssessment.travelTips.length > 0 && (
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Travel Tips
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {riskAssessment.travelTips.map((tip, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '12px 14px',
                  background: 'rgba(6,182,212,0.05)',
                  border: '1px solid rgba(6,182,212,0.15)',
                  borderRadius: '10px',
                  alignItems: 'flex-start',
                }}
              >
                <Info size={14} color="#22d3ee" style={{ flexShrink: 0, marginTop: '1px' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
