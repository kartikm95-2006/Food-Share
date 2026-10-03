import React, { useState } from 'react';
import { donationsApi } from '../api';
import { X, Sparkles, AlertCircle, Camera } from 'lucide-react';

export default function AddDonationModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    food_name: '',
    food_type: 'cooked',
    quantity: '20',
    unit: 'meals',
    description: '',
    location: 'Thane West',
    pickup_address: 'Green Campus Cafe, Ghodbunder Road, Thane',
    expiryHours: '3',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const photoOptions = [
    { label: '🍛 Dum Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80' },
    { label: '🍚 Pulao & Curry', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80' },
    { label: '🥖 Fresh Bread/Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80' },
    { label: '🍎 Fresh Fruit Crate', url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=80' },
    { label: '📦 Packaged Goods', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.food_name.trim()) {
      setError('Please enter the name of the food item.');
      return;
    }

    try {
      setLoading(true);
      const now = new Date();
      const availableFrom = now.toISOString();
      const expiryHoursNum = parseFloat(formData.expiryHours) || 3;
      const availableUntil = new Date(now.getTime() + expiryHoursNum * 3600000).toISOString();

      const payload = {
        food_name: formData.food_name,
        food_type: formData.food_type,
        quantity: parseInt(formData.quantity, 10),
        unit: formData.unit,
        description: formData.description,
        location: formData.location,
        pickup_address: formData.pickup_address,
        available_from: availableFrom,
        available_until: availableUntil,
        image_url: formData.image_url
      };

      await donationsApi.create(payload);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to publish donation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Donate Excess Food 🍱</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Broadcast surplus meals to local NGOs and shelters instantly
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-dim)', padding: '4px', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fb7185',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Food Name */}
            <div className="form-group">
              <label className="form-label">
                <span>Food Item Name *</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>e.g., Vegetable Biryani</span>
              </label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g., Fresh Dal Makhani & Jeera Rice"
                value={formData.food_name}
                onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
              />
            </div>

            {/* Food Type & Quantity row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.food_type}
                  onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                >
                  <option value="cooked">Cooked Meals</option>
                  <option value="packaged">Packaged Goods</option>
                  <option value="bakery">Bakery / Breads</option>
                  <option value="fruits_veg">Fresh Produce</option>
                  <option value="other">Other Supply</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unit</label>
                <select
                  className="form-select"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="meals">meals</option>
                  <option value="packets">packets</option>
                  <option value="kg">kg</option>
                  <option value="boxes">boxes</option>
                </select>
              </div>
            </div>

            {/* Expiry Window (Smart Urgency Timer Setup!) */}
            <div className="form-group">
              <label className="form-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Sparkles size={14} color="var(--accent-amber)" />
                  Available Until (Expiry Window)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Calculates live urgency</span>
              </label>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {[
                  { label: '⏱️ 45 mins (Urgent demo)', val: '0.75' },
                  { label: '2 Hours', val: '2' },
                  { label: '4 Hours', val: '4' },
                  { label: 'Tonight (6h)', val: '6' },
                  { label: 'Tomorrow (24h)', val: '24' }
                ].map((preset) => (
                  <button
                    type="button"
                    key={preset.val}
                    onClick={() => setFormData({ ...formData, expiryHours: preset.val })}
                    style={{
                      background: formData.expiryHours === preset.val ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                      color: formData.expiryHours === preset.val ? '#fff' : 'var(--text-main)',
                      border: '1px solid var(--border-subtle)',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pickup Location & Address */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">City / Area *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Thane West"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specific Pickup Address *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. College Canteen Gate #2"
                  value={formData.pickup_address}
                  onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                />
              </div>
            </div>

            {/* Description / Diet info */}
            <div className="form-group">
              <label className="form-label">Description & Dietary Notes</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Mention if Pure Vegetarian, Jain friendly, packed in containers, utensils required, etc."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Image Preset Picker */}
            <div className="form-group">
              <label className="form-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Camera size={14} />
                  Food Image Preview
                </span>
              </label>

              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                {photoOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.url}
                    onClick={() => setFormData({ ...formData, image_url: opt.url })}
                    style={{
                      border: formData.image_url === opt.url ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: 'var(--bg-surface-elevated)',
                      padding: '4px',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img src={opt.url} alt={opt.label} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ fontSize: '0.65rem', marginTop: '2px', color: 'var(--text-muted)' }}>{opt.label.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Publishing...' : 'Publish Donation 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
