import React, { useState, useEffect } from 'react';
import { claimsApi, donationsApi } from '../api';
import StatusBadge from '../components/StatusBadge';
import { HeartHandshake, Truck, CheckCircle, MapPin, Phone, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NgoDashboard({ onViewDetails, onUpdateStatus, setActiveTab }) {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await claimsApi.getMy();
      setClaims(res.claims || []);
    } catch (err) {
      console.error('Failed to load claims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const totalMealsClaimed = claims.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const activeCount = claims.filter((c) => c.donation_status === 'claimed').length;
  const inTransitCount = claims.filter((c) => c.donation_status === 'picked_up').length;
  const completedCount = claims.filter((c) => c.donation_status === 'completed').length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user?.organization || user?.name}</span>
            <span className="badge badge-picked_up">NGO Volunteer Portal</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Coordinate pickups, track volunteers in transit, and confirm distribution to shelters
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchClaims} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button onClick={() => setActiveTab('explore')} className="btn btn-primary">
            <HeartHandshake size={15} />
            <span>+ Claim Available Food</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '32px'
        }}
      >
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Meals Rescued by NGO
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6', marginTop: '4px' }}>
            {totalMealsClaimed}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across {claims.length} food claims</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Pending Collection
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting volunteer dispatch</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            In-Transit / Picked Up
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', marginTop: '4px' }}>
            {inTransitCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>En route to shelter</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Distributed & Completed
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Successfully nourished community</div>
        </div>
      </div>

      {/* Claims List Table / Cards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>My Claimed Donations Pipeline</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            Showing {claims.length} claims
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading your claims...
          </div>
        ) : claims.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <AlertCircle size={40} color="var(--text-dim)" />
            <h3 style={{ fontSize: '1.2rem' }}>No food claimed yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '380px' }}>
              Explore available donations from colleges and restaurants in Thane and claim them before expiry.
            </p>
            <button onClick={() => setActiveTab('explore')} className="btn btn-primary">
              <HeartHandshake size={15} />
              <span>Browse Available Food</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="glass-panel"
                style={{
                  padding: '18px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                {/* Food & Donor Info */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', minWidth: '280px' }}>
                  <img
                    src={claim.image_url}
                    alt={claim.food_name}
                    style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{claim.food_name}</h3>
                      <StatusBadge status={claim.donation_status} />
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }}>
                      {claim.quantity} {claim.unit}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={12} />
                      <span>{claim.pickup_address}, {claim.location}</span>
                    </div>
                  </div>
                </div>

                {/* Donor Contact & ETA */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '180px' }}>
                  <div>
                    Donor: <strong>{claim.donor_org || claim.donor_name}</strong>
                  </div>
                  {claim.donor_phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', marginTop: '2px' }}>
                      <Phone size={12} />
                      <span>{claim.donor_phone}</span>
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Claimed: {new Date(claim.claimed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Status Advancement Buttons */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {claim.donation_status === 'claimed' && (
                    <button
                      onClick={async () => {
                        await onUpdateStatus(claim.id, 'picked_up');
                        fetchClaims();
                      }}
                      className="btn btn-accent btn-sm"
                    >
                      <Truck size={14} />
                      <span>Mark Picked Up</span>
                    </button>
                  )}

                  {claim.donation_status === 'picked_up' && (
                    <button
                      onClick={async () => {
                        await onUpdateStatus(claim.id, 'completed');
                        fetchClaims();
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ background: '#8b5cf6' }}
                    >
                      <CheckCircle size={14} />
                      <span>Mark Delivered 🎉</span>
                    </button>
                  )}

                  {claim.donation_status === 'completed' && (
                    <span
                      style={{
                        color: '#10b981',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle size={15} />
                      Completed & Logged
                    </span>
                  )}

                  <button
                    onClick={() => onViewDetails({ id: claim.donation_id })}
                    className="btn btn-secondary btn-sm"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
