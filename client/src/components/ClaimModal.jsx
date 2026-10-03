import React, { useState } from 'react';
import { claimsApi } from '../api';
import { X, HeartHandshake, MapPin, Clock, Phone, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ClaimModal({ donation, isOpen, onClose, onClaimed }) {
  const { user } = useAuth();
  const [pickupMinutes, setPickupMinutes] = useState('45');
  const [notes, setNotes] = useState('Volunteer vehicle dispatched with thermal carrier boxes.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !donation) return null;

  const handleConfirmClaim = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const estimatedPickup = new Date(Date.now() + parseInt(pickupMinutes, 10) * 60000).toISOString();

      await claimsApi.claim(donation.id, {
        notes,
        pickup_time: estimatedPickup
      });

      onClaimed();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to claim donation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HeartHandshake size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Confirm Food Claim</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Lock this batch for your NGO to prevent duplicate pickups
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-dim)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmClaim}>
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

            {/* Donation Summary Box */}
            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '18px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {donation.food_name}
                </span>
                <span
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 800
                  }}
                >
                  {donation.quantity} {donation.unit}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="var(--primary)" />
                  <span>{donation.pickup_address}, {donation.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="var(--accent-amber)" />
                  <span>Must be collected before: {new Date(donation.available_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {donation.donor_phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                    <Phone size={14} />
                    <span>Donor Contact: {donation.donor_phone} ({donation.donor_org || donation.donor_name})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Estimated Pickup Time */}
            <div className="form-group">
              <label className="form-label">
                <span>Estimated Arrival Time for Pickup</span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: '30 mins', val: '30' },
                  { label: '45 mins', val: '45' },
                  { label: '1 Hour', val: '60' },
                  { label: '90 mins', val: '90' }
                ].map((p) => (
                  <button
                    type="button"
                    key={p.val}
                    onClick={() => setPickupMinutes(p.val)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      background: pickupMinutes === p.val ? '#3b82f6' : 'var(--bg-surface)',
                      color: pickupMinutes === p.val ? '#fff' : 'var(--text-muted)',
                      border: `1px solid ${pickupMinutes === p.val ? '#3b82f6' : 'var(--border-subtle)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Coordination Notes */}
            <div className="form-group">
              <label className="form-label">
                <span>Volunteer & Vehicle Notes</span>
              </label>
              <textarea
                className="form-textarea"
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention volunteer contact, vehicle number, or collection notes"
              />
            </div>

            {/* NGO info confirmation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                background: 'rgba(59, 130, 246, 0.08)',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <ShieldCheck size={16} color="#3b82f6" />
              <span>
                Claiming as <strong>{user?.organization || user?.name}</strong>. The donor will be notified instantly.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
            >
              {loading ? 'Claiming...' : 'Confirm Claim 🤝'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
