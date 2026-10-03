import React, { useState, useEffect } from 'react';
import { donationsApi } from '../api';
import DonationCard from '../components/DonationCard';
import { PlusCircle, RefreshCw, Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DonorDashboard({ onOpenAddDonation, onViewDetails, onClaim, onUpdateStatus }) {
  const { user } = useAuth();
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyDonations = async () => {
    try {
      setLoading(true);
      const res = await donationsApi.getMy();
      setMyDonations(res.donations || []);
    } catch (err) {
      console.error('Failed to load my donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const totalMeals = myDonations.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const activeCount = myDonations.filter((d) => d.status === 'available').length;
  const claimedCount = myDonations.filter((d) => ['claimed', 'picked_up'].includes(d.status)).length;
  const completedCount = myDonations.filter((d) => d.status === 'completed').length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* Top Welcome Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome, {user?.name} 👋</span>
            <span className="badge badge-available">Donor Portal</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            {user?.organization || 'Individual Donor'} • {user?.location || 'Thane West'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchMyDonations}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onOpenAddDonation}
            className="btn btn-primary"
          >
            <PlusCircle size={16} />
            <span>+ New Food Donation</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
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
            My Total Meals Shared
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
            {totalMeals}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across {myDonations.length} total batches</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Active / Available
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting NGO claim</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Claimed / In Transit
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {claimedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NGO vehicle on the way</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Completed Deliveries
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Successfully fed community</div>
        </div>
      </div>

      {/* Donations List Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>My Donation Listings</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            Showing {myDonations.length} records
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading your donations...
          </div>
        ) : myDonations.length === 0 ? (
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
            <Package size={40} color="var(--text-dim)" />
            <h3 style={{ fontSize: '1.2rem' }}>You have not posted any food donations yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '380px' }}>
              Whenever you or your canteen have excess food, click the button below to publish it in real-time.
            </p>
            <button onClick={onOpenAddDonation} className="btn btn-primary">
              <PlusCircle size={15} />
              <span>Donate Food Now</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
            {myDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onClaim={onClaim}
                onViewDetails={onViewDetails}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
