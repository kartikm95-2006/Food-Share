import React, { useState, useEffect } from 'react';
import { donationsApi } from '../api';
import StatusBadge from './StatusBadge';
import ExpiryTimer from './ExpiryTimer';
import { 
  X, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle, 
  Calendar, 
  HeartHandshake, 
  Phone, 
  FileText, 
  Trash2,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DonationDetailsModal({ donationId, isOpen, onClose, onRefresh, onClaimRequested }) {
  const { user } = useAuth();
  const [details, setDetails] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !donationId) return;

    async function fetchDetails() {
      try {
        setLoading(true);
        const res = await donationsApi.getById(donationId);
        setDetails(res.donation);
        setLogs(res.logs || []);
      } catch (err) {
        console.error('Failed to fetch details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [donationId, isOpen]);

  if (!isOpen) return null;

  const isOwner = user?.id === details?.donor_id;
  const isAdmin = user?.role === 'admin';
  const isNgo = user?.role === 'ngo';

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to cancel and remove this donation?')) return;
    try {
      await donationsApi.delete(details.id);
      onRefresh();
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to delete donation');
    }
  };

  // Pipeline step status calculation
  const getStepStatus = (stepName) => {
    if (!details) return 'pending';
    const status = details.status;

    if (stepName === 'created') return 'completed';

    if (stepName === 'claimed') {
      if (['claimed', 'picked_up', 'completed'].includes(status)) return 'completed';
      return 'pending';
    }

    if (stepName === 'picked_up') {
      if (['picked_up', 'completed'].includes(status)) return 'completed';
      if (status === 'claimed') return 'active';
      return 'pending';
    }

    if (stepName === 'completed') {
      if (status === 'completed') return 'completed';
      if (status === 'picked_up') return 'active';
      return 'pending';
    }

    return 'pending';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Donation Details</h2>
            {details && <StatusBadge status={details.status} isUrgent={details.is_urgent} />}
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-dim)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {loading || !details ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading donation specifications...
            </div>
          ) : (
            <div>
              {/* Photo Banner */}
              <div style={{ height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '18px', position: 'relative' }}>
                <img
                  src={details.image_url}
                  alt={details.food_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                  <ExpiryTimer availableUntil={details.available_until} status={details.status} />
                </div>
              </div>

              {/* Title & Quantity */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{details.food_name}</h1>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    Category: {details.food_type.replace('_', ' & ')}
                  </span>
                </div>
                <div
                  style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '1.1rem'
                  }}
                >
                  {details.quantity} {details.unit}
                </div>
              </div>

              {/* Status Pipeline Progress Visualizer */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', margin: '16px 0', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Food Rescue Lifecycle Pipeline
                </div>

                <div className="pipeline-steps">
                  <div className="pipeline-line">
                    <div
                      className="pipeline-line-fill"
                      style={{
                        width:
                          details.status === 'completed'
                            ? '100%'
                            : details.status === 'picked_up'
                            ? '75%'
                            : details.status === 'claimed'
                            ? '40%'
                            : '0%'
                      }}
                    />
                  </div>

                  {/* Step 1: Created */}
                  <div className={`pipeline-node ${getStepStatus('created')}`}>
                    <div className="pipeline-dot">1</div>
                    <span className="pipeline-label">Created</span>
                  </div>

                  {/* Step 2: Claimed */}
                  <div className={`pipeline-node ${getStepStatus('claimed')}`}>
                    <div className="pipeline-dot">2</div>
                    <span className="pipeline-label">Claimed</span>
                  </div>

                  {/* Step 3: Picked Up */}
                  <div className={`pipeline-node ${getStepStatus('picked_up')}`}>
                    <div className="pipeline-dot">3</div>
                    <span className="pipeline-label">Picked Up</span>
                  </div>

                  {/* Step 4: Completed */}
                  <div className={`pipeline-node ${getStepStatus('completed')}`}>
                    <div className="pipeline-dot">4</div>
                    <span className="pipeline-label">Completed</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {details.description && (
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Description & Dietary Notes
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5, background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '8px' }}>
                    {details.description}
                  </p>
                </div>
              )}

              {/* Location & Time specs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
                    <MapPin size={15} />
                    <span>Pickup Location</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{details.location}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{details.pickup_address}</div>
                </div>

                <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
                    <Clock size={15} />
                    <span>Expiry Window</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    Until {new Date(details.available_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Posted: {new Date(details.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Stakeholders info: Donor & Claiming NGO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Donor Organization
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{details.donor_org || details.donor_name}</div>
                  {details.donor_phone && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Phone size={12} />
                      {details.donor_phone}
                    </div>
                  )}
                </div>

                <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Claimed NGO / Volunteer
                  </div>
                  {details.ngo_name ? (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#3b82f6' }}>
                        {details.ngo_org || details.ngo_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Notes: {details.claim_notes || 'Pickup coordinated'}
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                      Not yet claimed. Available for collection.
                    </span>
                  )}
                </div>
              </div>

              {/* Activity Audit Trail Logs */}
              {logs.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={14} />
                    Audit Trail & Real-time Logs
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        style={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{log.action}</span>: {log.details}
                        </div>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div>
            {(isOwner || isAdmin) && (
              <button
                onClick={handleDelete}
                className="btn btn-danger btn-sm"
              >
                <Trash2 size={14} />
                <span>Cancel Donation</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
            {details?.status === 'available' && (isNgo || isAdmin) && (
              <button
                onClick={() => {
                  onClose();
                  onClaimRequested(details);
                }}
                className="btn btn-primary"
              >
                <HeartHandshake size={15} />
                <span>Claim This Food</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
