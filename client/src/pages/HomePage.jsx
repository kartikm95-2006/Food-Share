import React, { useEffect, useState } from 'react';
import { donationsApi, statsApi } from '../api';
import DonationCard from '../components/DonationCard';
import { 
  Heart, 
  Utensils, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Award,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ onOpenAddDonation, onViewDetails, onClaim, onUpdateStatus, setActiveTab }) {
  const { user } = useAuth();
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

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* Hero Section */}
      <section
        style={{
          background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.18) 0%, rgba(11, 15, 25, 0) 70%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '60px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '40px'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: '20px', color: '#10b981', fontSize: '0.82rem', fontWeight: 700, marginBottom: '20px' }}>
          <Sparkles size={14} />
          <span>Real-time Food Waste Reduction & Community Feeding</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
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
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            margin: '0 auto 28px',
            lineHeight: 1.6
          }}
        >
          FoodShare bridges college canteens, restaurants, and event organizers with verified local NGOs
          to redirect edible surplus meals to people who need them before they expire.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenAddDonation}
            className="btn btn-primary btn-lg"
          >
            <Utensils size={18} />
            <span>Donate Food Now</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className="btn btn-secondary btn-lg"
          >
            <span>Browse Available Food</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Syllabus / Project Badge */}
        <div style={{ marginTop: '28px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          Developed for <strong>Web & Mobile Development (WMD)</strong> Mini-Project • CSE (AIML)
        </div>
      </section>

      {/* Live Impact Counters Section */}
      <section style={{ marginBottom: '50px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}
        >
          {/* Card 1: Meals */}
          <div
            className="glass-panel"
            style={{ padding: '24px', textAlign: 'center', transition: 'transform 0.2s ease' }}
          >
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
              {impactStats ? impactStats.totalMeals.toLocaleString() : '1,250'}+
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '8px', color: 'var(--text-main)' }}>
              Meals Rescued & Donated
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Directly diverted from waste
            </div>
          </div>

          {/* Card 2: Kg saved */}
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#3b82f6', lineHeight: 1 }}>
              {impactStats ? impactStats.estimatedKgSaved.toLocaleString() : '560'} kg
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '8px', color: 'var(--text-main)' }}>
              Edible Food Preserved
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Weighed across donor pickups
            </div>
          </div>

          {/* Card 3: CO2 emissions */}
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>
              {impactStats ? impactStats.co2SavedKg.toLocaleString() : '1,400'} kg
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '8px', color: 'var(--text-main)' }}>
              CO₂e Greenhouse Prevented
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Methane reduction calculation
            </div>
          </div>

          {/* Card 4: Active Volunteers & NGOs */}
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#8b5cf6', lineHeight: 1 }}>
              {impactStats ? `${impactStats.partnerNgos} NGOs` : '12 NGOs'}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '8px', color: 'var(--text-main)' }}>
              Rescue Partners in Thane
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Shelters, rotibanks, volunteers
            </div>
          </div>
        </div>
      </section>

      {/* How FoodShare Works */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>How FoodShare Works in 3 Steps</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Frictionless handoff from donors to verified field volunteers
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Step 1 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '14px'
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Donor Posts Surplus</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Canteen, restaurant, or individual posts meal type, quantity, pickup location, and expiry window with photo.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '14px'
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>NGO Claims & Picks Up</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Local NGO or volunteer locks the batch with 1-click claim, dispatches vehicle, and marks status as "Picked Up".
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '14px'
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Community Fed & Logged</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Meals distributed to shelter homes, status updated to "Completed", and environmental impact counters update in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Live Recent Donations Feed */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Live Rescue Feed</span>
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
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Real-time available & recently claimed donations across Thane
            </p>
          </div>

          <button
            onClick={() => setActiveTab('explore')}
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>View All</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading active donations...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
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
