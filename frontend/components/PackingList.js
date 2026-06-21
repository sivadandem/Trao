'use client';

import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Package } from 'lucide-react';
import { tripService } from '../services/tripService';
import { packingCategoryIcon, getPackingProgress } from '../lib/utils';

const CATEGORIES = [
  'documents', 'clothing', 'electronics', 'medicine', 'activity-equipment', 'weather-essentials', 'other',
];

export default function PackingList({ packingList = [], tripId, onUpdate }) {
  const [addForm, setAddForm] = useState({ item: '', category: 'other' });
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const progress = getPackingProgress(packingList);

  const handleToggle = async (itemId, currentCompleted) => {
    setUpdatingId(itemId);
    try {
      const data = await tripService.updatePackingItem(tripId, itemId, !currentCompleted);
      onUpdate(data.data.trip);
    } catch (err) {
      console.error('Update packing item error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setRemovingId(itemId);
    try {
      const data = await tripService.removePackingItem(tripId, itemId);
      onUpdate(data.data.trip);
    } catch (err) {
      console.error('Remove packing item error:', err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAdd = async () => {
    if (!addForm.item.trim()) return;
    setAdding(true);
    try {
      const data = await tripService.addPackingItem(tripId, addForm.item, addForm.category);
      onUpdate(data.data.trip);
      setAddForm({ item: '', category: 'other' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Add packing item error:', err);
    } finally {
      setAdding(false);
    }
  };

  // Group items by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = packingList.filter((i) => i.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const filteredGroups = activeCategory === 'all'
    ? grouped
    : { [activeCategory]: grouped[activeCategory] || [] };

  const completedCount = packingList.filter((i) => i.completed).length;

  return (
    <div>
      {/* Progress */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={16} color="#6366f1" />
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Packing Progress
            </span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '700', color: progress === 100 ? '#4ade80' : '#6366f1' }}>
            {completedCount}/{packingList.length} items
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
              background: progress === 100
                ? 'linear-gradient(135deg, #22c55e, #4ade80)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            }}
          />
        </div>
        <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
          {progress}% packed {progress === 100 && '🎉 Ready to go!'}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveCategory('all')}
          className={`tab-item ${activeCategory === 'all' ? 'active' : ''}`}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          All ({packingList.length})
        </button>
        {CATEGORIES.filter((c) => grouped[c]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`tab-item ${activeCategory === cat ? 'active' : ''}`}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            {packingCategoryIcon[cat]} {cat.replace(/-/g, ' ')} ({grouped[cat]?.length || 0})
          </button>
        ))}
      </div>

      {/* Items by category */}
      {Object.entries(filteredGroups).map(([category, items]) => (
        <div key={category} style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
              paddingBottom: '8px',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <span style={{ fontSize: '16px' }}>{packingCategoryIcon[category]}</span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {category.replace(/-/g, ' ')}
            </span>
          </div>

          {items.map((item) => (
            <div
              key={item._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                background: item.completed ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${item.completed ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)'}`,
                marginBottom: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <button
                onClick={() => handleToggle(item._id, item.completed)}
                disabled={updatingId === item._id}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}
                aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
              >
                {item.completed ? (
                  <CheckCircle2 size={18} color="#4ade80" />
                ) : (
                  <Circle size={18} color="var(--text-muted)" />
                )}
              </button>

              <span
                style={{
                  flex: 1,
                  fontSize: '14px',
                  color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: item.completed ? 'line-through' : 'none',
                }}
              >
                {item.item}
              </span>

              <button
                onClick={() => handleRemove(item._id)}
                disabled={removingId === item._id}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  opacity: 0.6,
                  transition: 'opacity 0.2s',
                }}
                aria-label={`Remove ${item.item}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      ))}

      {/* Add item form */}
      {showAddForm ? (
        <div
          style={{
            background: 'rgba(99,102,241,0.05)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '10px',
            padding: '14px',
            marginTop: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              className="form-input"
              style={{ flex: 1, padding: '10px 14px', fontSize: '13px', minWidth: '180px' }}
              value={addForm.item}
              onChange={(e) => setAddForm({ ...addForm, item: e.target.value })}
              placeholder="Item name..."
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '160px', padding: '10px 40px 10px 14px', fontSize: '13px' }}
              value={addForm.category}
              onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {packingCategoryIcon[c]} {c.replace(/-/g, ' ')}
                </option>
              ))}
            </select>
            <button onClick={handleAdd} disabled={adding || !addForm.item.trim()} className="btn-primary" style={{ padding: '10px 16px', fontSize: '13px' }}>
              {adding ? <span className="spinner" style={{ width: '14px', height: '14px' }} /> : <Plus size={14} />}
              Add
            </button>
            <button onClick={() => setShowAddForm(false)} className="btn-secondary" style={{ padding: '10px 14px', fontSize: '13px' }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            border: '1px dashed rgba(99,102,241,0.3)',
            borderRadius: '10px',
            background: 'transparent',
            color: '#818cf8',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          <Plus size={15} />
          Add Custom Item
        </button>
      )}
    </div>
  );
}
