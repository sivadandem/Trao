'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripSchema } from '../lib/validations';
import { useState } from 'react';
import { Sparkles, MapPin, Calendar, DollarSign, X } from 'lucide-react';
import { interestEmojis } from '../lib/utils';

const INTERESTS = ['food', 'culture', 'adventure', 'shopping', 'nature', 'nightlife', 'family', 'history'];

export default function TripGenerateForm({ onSubmit, onCancel, generating, loading }) {
  const isLoading = generating || loading;
  const [selectedInterests, setSelectedInterests] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      destination: '',
      durationDays: 5,
      budgetTier: '',
      interests: [],
    },
  });

  const toggleInterest = (interest) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(updated);
    setValue('interests', updated, { shouldValidate: true });
  };

  const onFormSubmit = (data) => {
    onSubmit({ ...data, interests: selectedInterests });
  };

  return (
    <div className="glass" style={{ borderRadius: '20px', padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Plan a New Trip
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>AI will generate a full itinerary in seconds</p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}
      </div>
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {/* Destination */}
      <div className="form-group">
        <label className="form-label" htmlFor="destination">
          <MapPin size={12} style={{ display: 'inline', marginRight: '6px' }} />
          Destination
        </label>
        <input
          id="destination"
          className="form-input"
          placeholder="e.g. Tokyo, Japan or Paris, France"
          {...register('destination')}
          aria-describedby="destination-error"
        />
        {errors.destination && (
          <div id="destination-error" className="form-error">⚠ {errors.destination.message}</div>
        )}
      </div>

      {/* Duration */}
      <div className="form-group">
        <label className="form-label" htmlFor="durationDays">
          <Calendar size={12} style={{ display: 'inline', marginRight: '6px' }} />
          Number of Days
        </label>
        <input
          id="durationDays"
          className="form-input"
          type="number"
          min="1"
          max="30"
          placeholder="1 - 30 days"
          {...register('durationDays', { valueAsNumber: true })}
          aria-describedby="duration-error"
        />
        {errors.durationDays && (
          <div id="duration-error" className="form-error">⚠ {errors.durationDays.message}</div>
        )}
      </div>

      {/* Budget Tier */}
      <div className="form-group">
        <label className="form-label" htmlFor="budgetTier">
          <DollarSign size={12} style={{ display: 'inline', marginRight: '6px' }} />
          Budget Tier
        </label>
        <select
          id="budgetTier"
          className="form-select"
          {...register('budgetTier')}
          aria-describedby="budget-error"
        >
          <option value="">Select a budget tier</option>
          <option value="low">💚 Low — Budget-Friendly</option>
          <option value="medium">💛 Medium — Mid-Range</option>
          <option value="high">💜 High — Luxury</option>
        </select>
        {errors.budgetTier && (
          <div id="budget-error" className="form-error">⚠ {errors.budgetTier.message}</div>
        )}
      </div>

      {/* Interests */}
      <div className="form-group">
        <label className="form-label">Interests (select at least 1)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`interest-tag ${selectedInterests.includes(interest) ? 'selected' : ''}`}
              aria-pressed={selectedInterests.includes(interest)}
            >
              {interestEmojis[interest]}
              <span style={{ textTransform: 'capitalize' }}>{interest}</span>
            </button>
          ))}
        </div>
        {errors.interests && (
          <div className="form-error">⚠ {errors.interests.message}</div>
        )}
        {selectedInterests.length > 0 && (
          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {selectedInterests.map((i) => (
              <span
                key={i}
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(99,102,241,0.2)',
                  color: '#818cf8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {i}
                <button
                  type="button"
                  onClick={() => toggleInterest(i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex' }}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
        disabled={isLoading}
        id="generate-trip-btn"
      >
        {isLoading ? (
          <>
            <span className="spinner" />
            Generating your itinerary...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Generate AI Itinerary
          </>
        )}
      </button>

      {isLoading && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            background: 'rgba(99,102,241,0.05)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '10px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          ✨ Gemini AI is crafting your personalized itinerary. This may take 10–30 seconds...
        </div>
      )}
    </form>
    </div>
  );
}
