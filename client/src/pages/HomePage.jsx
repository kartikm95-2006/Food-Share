import React, { useEffect, useState } from 'react';
import { donationsApi, statsApi } from '../api';
import DonationCard from '../components/DonationCard';
import { 
  Utensils, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  Award,
  ChevronRight,
  Package,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ onOpenAddDonation, onViewDetails, onClaim, onUpdateStatus, setActiveTab }) {
  const { user, quickSwitch, demoUsers } = useAuth();
  const [recentDonations, setRecentDonations] = useState([]);
  const [impactStats, setImpactStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [donRes, statsRes] = await Promise.all([
          donationsApi.getAll({ status: 'all' }),
          statsApi.getImpact()
        ]);
        setRecentDonations((donRes.donations || []).slice(0, 4));
        setImpactStats(statsRes);
      } catch (err) {
        console.error('Home page data fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleEnterPortal = (roleName) => {
    const demoUser = demoUsers.find((u) => u.role === roleName);
    if (demoUser) {
      quickSwitch(demoUser);
    }
    if (roleName === 'donor') setActiveTab('donor_dashboard');
    else if (roleName === 'ngo') setActiveTab('ngo_dashboard');
    else if (roleName === 'admin') setActiveTab('admin_dashboard');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* Hero Section */}
      <section
        style={{
          background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.15) 0%, rgba(11, 15, 25, 0) 70%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '50px 24px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '5px 14px', borderRadius: '20px', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, marginBottom: '16px' }}>
          <Sparkles size={14} />
          <span>Real-time Surplus Food Rescue Platform</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '14px',
            lineHeight: 1.15
          }}
        >
          Don’t Waste Surplus Food. <br />
          <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Share It Instantly.
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            maxWidth: '650px',
            margin: '0 auto 28px',
            lineHeight: 1.6
          }}
        >
          FoodShare segregates operations into dedicated workspaces for Food Donors,
          verified NGO collection teams, and Faculty/Admin supervisors.
        </p>

        {/* 3 Dedicated Segregated Portal Gateway Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            textAlign: 'left',
            marginTop: '10px'
          }}
        >
          {/* 1. Donor Gateway */}
          <div
            className="glass-panel"
            style={{
              padding: '22px',
              borderTop: '4px solid #10b981',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: user?.role === 'donor' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🍛</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '4px' }}>
                  DONOR
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>Food Donor Portal</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '16px' }}>
                Post excess meals from canteens or events, set safe expiry timers, and monitor when volunteers arrive.
              </p>
            </div>

            <button
              onClick={() => handleEnterPortal('donor')}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <span>{user?.role === 'donor' ? 'Go to My Dashboard' : 'Open Donor Portal'}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 2. NGO Gateway */}
          <div
            className="glass-panel"
            style={{
              padding: '22px',
              borderTop: '4px solid #3b82f6',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: user?.role === 'ngo' ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-surface)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>🤝</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px' }}>
                  NGO & SHELTER
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>NGO Volunteer Portal</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '16px' }}>
                Explore fresh food batches across Thane, lock 1-click claims, dispatch vehicles, and confirm distribution.
              </p>
            </div>

            <button
              onClick={() => handleEnterPortal('ngo')}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '0.85rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
            >
              <span>{user?.role === 'ngo' ? 'Go to My Claims' : 'Open NGO Portal'}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 3. Admin Gateway */}
          <div
            className="glass-panel"
            style={{
              padding: '22px',
              borderTop: '4px solid #f59e0b',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: user?.role === 'admin' ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-surface)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>⚡</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '2px 8px', borderRadius: '4px' }}>
                  ADMIN
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>Admin & Faculty Console</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '16px' }}>
                Review live SQLite tables, manage user roles, audit real-time activity logs, and override batch statuses.
              </p>
            </div>

            <button
              onClick={() => handleEnterPortal('admin')}
              className="btn btn-accent"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <span>{user?.role === 'admin' ? 'Open Admin Console' : 'Open Admin Console'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Live Impact Counters Section */}
      <section style={{ marginBottom: '40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}
        >
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
              {impactStats ? impactStats.totalMeals.toLocaleString() : '1,250'}+
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '6px', color: 'var(--text-main)' }}>
              Meals Rescued & Donated
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3b82f6', lineHeight: 1 }}>
              {impactStats ? impactStats.estimatedKgSaved.toLocaleString() : '560'} kg
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '6px', color: 'var(--text-main)' }}>
              Edible Food Diverted
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>
              {impactStats ? impactStats.co2SavedKg.toLocaleString() : '1,400'} kg
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '6px', color: 'var(--text-main)' }}>
              Greenhouse Gases Averted
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#8b5cf6', lineHeight: 1 }}>
              {impactStats ? `${impactStats.partnerNgos} NGOs` : '12 NGOs'}
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '6px', color: 'var(--text-main)' }}>
              Rescue Partners in Thane
            </div>
          </div>
        </div>
      </section>

      {/* Live Rescue Feed Preview */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Live Community Food Feed</span>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981'
                }}
              />
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Active surplus food batches awaiting collection across Thane
            </p>
          </div>

          <button
            onClick={() => setActiveTab('explore')}
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Explore All</span>
            <ChevronRight size={15} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading active donations...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
            {recentDonations.map((donation) => (
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
      </section>

    </div>
  );
}
