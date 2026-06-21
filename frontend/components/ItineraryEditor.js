'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit3, RefreshCw, ChevronDown, ChevronUp, Clock, DollarSign, Check, X, Loader2 } from 'lucide-react';
import { tripService } from '../services/tripService';
import { formatCurrency } from '../lib/utils';

function ActivityItem({ activity, dayNumber, tripId, onUpdate, isEditing, setEditingId }) {
  const [localActivity, setLocalActivity] = useState({ ...activity });
  const [saving, setSaving] = useState(false);
  const cleanTripId = typeof tripId === 'object' && tripId ? (tripId._id || tripId.id) : tripId;

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await tripService.editActivity(cleanTripId, dayNumber, activity._id, {
        title: localActivity.title,
        description: localActivity.description,
        estimatedCost: Number(localActivity.estimatedCost),
        time: localActivity.time,
      });
      onUpdate(data.data.trip);
      setEditingId(null);
    } catch (err) {
      console.error('Edit activity error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const data = await tripService.removeActivity(cleanTripId, dayNumber, activity._id);
      onUpdate(data.data.trip);
    } catch (err) {
      console.error('Remove activity error:', err);
    }
  };

  if (isEditing) {
    return (
      <div
        style={{
          background: 'rgba(99,102,241,0.05)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '13px' }}
            value={localActivity.title}
            onChange={(e) => setLocalActivity({ ...localActivity, title: e.target.value })}
            placeholder="Activity title"
          />
          <textarea
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '13px', minHeight: '70px', resize: 'vertical' }}
            value={localActivity.description}
            onChange={(e) => setLocalActivity({ ...localActivity, description: e.target.value })}
            placeholder="Description"
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '13px' }}
              type="number"
              value={localActivity.estimatedCost}
              onChange={(e) => setLocalActivity({ ...localActivity, estimatedCost: e.target.value })}
              placeholder="Cost ($)"
            />
            <input
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '13px' }}
              type="text"
              value={localActivity.time}
              onChange={(e) => setLocalActivity({ ...localActivity, time: e.target.value })}
              placeholder="Time (e.g. 9:00 AM)"
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
              {saving ? <span className="spinner" style={{ width: '14px', height: '14px' }} /> : <Check size={14} />}
              Save
            </button>
            <button onClick={() => setEditingId(null)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '10px',
        padding: '14px',
        marginBottom: '10px',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {activity.title}
          </h4>
          {activity.description && (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '8px' }}>
              {activity.description}
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {activity.time && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <Clock size={12} /> {activity.time}
              </span>
            )}
            {activity.estimatedCost > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#4ade80' }}>
                <DollarSign size={12} /> {formatCurrency(activity.estimatedCost)}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={() => setEditingId(activity._id)}
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              color: '#818cf8',
              display: 'flex',
            }}
            title="Edit activity"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              color: '#f87171',
              display: 'flex',
            }}
            title="Remove activity"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddActivityForm({ dayNumber, tripId, onUpdate, onClose }) {
  const [form, setForm] = useState({ title: '', description: '', estimatedCost: '', time: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const cleanTripId = typeof tripId === 'object' && tripId ? (tripId._id || tripId.id) : tripId;

  const handleAdd = async () => {
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    try {
      const data = await tripService.addActivity(cleanTripId, dayNumber, {
        title: form.title,
        description: form.description || '',
        estimatedCostUSD: Number(form.estimatedCost) || 0,
        timeOfDay: form.time || '',
      });
      onUpdate(data.data.trip);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add activity');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        background: 'rgba(34,197,94,0.05)',
        border: '1px solid rgba(34,197,94,0.2)',
        borderRadius: '10px',
        padding: '14px',
        marginTop: '10px',
      }}
    >
      <h5 style={{ fontSize: '13px', fontWeight: '600', color: '#4ade80', marginBottom: '10px' }}>
        ✨ Add New Activity
      </h5>
      {error && <div className="alert alert-error" style={{ marginBottom: '10px', fontSize: '12px' }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input
          className="form-input"
          style={{ padding: '8px 12px', fontSize: '13px' }}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Activity title *"
        />
        <textarea
          className="form-input"
          style={{ padding: '8px 12px', fontSize: '13px', minHeight: '60px', resize: 'vertical' }}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description (optional)"
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '13px' }}
            type="number"
            value={form.estimatedCost}
            onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
            placeholder="Cost ($)"
          />
          <input
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '13px' }}
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            placeholder="Time (e.g. 2:00 PM)"
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleAdd} disabled={saving} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            {saving ? <span className="spinner" style={{ width: '14px', height: '14px' }} /> : <Plus size={14} />}
            Add Activity
          </button>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryEditor({ itinerary, tripId, onUpdate }) {
  const [expandedDay, setExpandedDay] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [addingToDay, setAddingToDay] = useState(null);
  const [regeneratingDay, setRegeneratingDay] = useState(null);
  const [regenInstructions, setRegenInstructions] = useState('');
  const [showRegenInput, setShowRegenInput] = useState(null);
  const cleanTripId = typeof tripId === 'object' && tripId ? (tripId._id || tripId.id) : tripId;

  const handleRegenerateDay = async (dayNumber) => {
    setRegeneratingDay(dayNumber);
    try {
      const data = await tripService.regenerateDay(cleanTripId, dayNumber, regenInstructions);
      onUpdate(data.data.trip);
      setShowRegenInput(null);
      setRegenInstructions('');
    } catch (err) {
      console.error('Regenerate day error:', err);
    } finally {
      setRegeneratingDay(null);
    }
  };

  if (!itinerary || itinerary.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        No itinerary available
      </div>
    );
  }

  return (
    <div>
      {itinerary.map((day) => (
        <div
          key={day.day}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            marginBottom: '12px',
            overflow: 'hidden',
            position: 'relative',
            opacity: regeneratingDay === day.day ? 0.7 : 1,
            pointerEvents: regeneratingDay === day.day ? 'none' : 'auto',
          }}
        >
          {/* Day Loading Overlay */}
          {regeneratingDay === day.day && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 10, 15, 0.75)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              gap: '10px',
            }}>
              <Loader2 size={20} className="spinner" style={{ animation: 'spin-slow 1s linear infinite', color: '#6366f1' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#818cf8' }}>Regenerating day with AI...</span>
            </div>
          )}
          {/* Day header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              cursor: 'pointer',
              background: expandedDay === day.day ? 'rgba(99,102,241,0.05)' : 'transparent',
            }}
            onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
            role="button"
            aria-expanded={expandedDay === day.day}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                {day.day}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  Day {day.day}
                </div>
                {day.theme && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{day.theme}</div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {day.activities?.length || 0} activities
              </span>
              {expandedDay === day.day ? (
                <ChevronUp size={16} color="var(--text-muted)" />
              ) : (
                <ChevronDown size={16} color="var(--text-muted)" />
              )}
            </div>
          </div>

          {/* Day content */}
          {expandedDay === day.day && (
            <div style={{ padding: '0 20px 20px' }}>

              {/* Activities */}
              {day.activities?.map((activity) => (
                <ActivityItem
                  key={activity._id}
                  activity={activity}
                  dayNumber={day.day}
                  tripId={tripId}
                  onUpdate={onUpdate}
                  isEditing={editingId === activity._id}
                  setEditingId={setEditingId}
                />
              ))}

              {/* Add activity */}
              {addingToDay === day.day ? (
                <AddActivityForm
                  dayNumber={day.day}
                  tripId={tripId}
                  onUpdate={onUpdate}
                  onClose={() => setAddingToDay(null)}
                />
              ) : (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setAddingToDay(day.day)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      border: '1px dashed rgba(99,102,241,0.3)',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: '#818cf8',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Plus size={13} />
                    Add Activity
                  </button>

                  {showRegenInput === day.day ? (
                    <div style={{ display: 'flex', gap: '8px', flex: 1, flexWrap: 'wrap' }}>
                      <input
                        className="form-input"
                        style={{ flex: 1, padding: '8px 12px', fontSize: '12px', minWidth: '200px' }}
                        value={regenInstructions}
                        onChange={(e) => setRegenInstructions(e.target.value)}
                        placeholder="E.g. more outdoor activities, budget-friendly..."
                      />
                      <button
                        onClick={() => handleRegenerateDay(day.day)}
                        disabled={regeneratingDay === day.day}
                        className="btn-primary"
                        style={{ padding: '8px 14px', fontSize: '12px' }}
                      >
                        {regeneratingDay === day.day ? (
                          <span className="spinner" style={{ width: '13px', height: '13px' }} />
                        ) : (
                          <RefreshCw size={13} />
                        )}
                        Regenerate
                      </button>
                      <button
                        onClick={() => setShowRegenInput(null)}
                        className="btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '12px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowRegenInput(day.day)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        border: '1px dashed rgba(139,92,246,0.3)',
                        borderRadius: '8px',
                        background: 'transparent',
                        color: '#a78bfa',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      <RefreshCw size={13} />
                      Regenerate Day
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
