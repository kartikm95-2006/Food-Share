import React, { useState, useEffect } from 'react';
import { donationsApi } from '../api';
import DonationCard from '../components/DonationCard';
import { Search, Filter, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ExplorePage({ onClaim, onViewDetails, onUpdateStatus, onOpenAddDonation }) {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('available');
  const [foodTypeFilter, setFoodTypeFilter] = useState('all');
  const [urgentOnly, setUrgentOnly] = useState(false);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await donationsApi.getAll({
        status: statusFilter,
        food_type: foodTypeFilter,
        search: searchTerm,
        urgent_only: urgentOnly
      });
      setDonations(res.donations || []);
    } catch (err) {
      console.error('Failed to load donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [statusFilter, foodTypeFilter, urgentOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonations();
  };

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'cooked', label: '🍛 Cooked Meals' },
    { id: 'packaged', label: '📦 Packaged Goods' },
    { id: 'bakery', label: '🥖 Bakery & Breads' },
    { id: 'fruits_veg', label: '🍎 Fresh Produce' }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 60px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
            Find & Rescue Surplus Food 🔎
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Browse available food donations across colleges, restaurants, and hostellers in Thane & Mumbai
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchDonations}
            className="btn btn-secondary btn-sm"
            title="Refresh listings"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          {(user?.role === 'donor' || user?.role === 'admin') && (
            <button
              onClick={onOpenAddDonation}
              className="btn btn-primary btn-sm"
            >
              <span>+ Add Donation</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                top: '50%',
                left: '12px',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)'
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Search by food name, location, or canteen (e.g. Biryani, Kasarvadavali)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Filter Badges Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFoodTypeFilter(cat.id)}
                style={{
                  background: foodTypeFilter === cat.id ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                  color: foodTypeFilter === cat.id ? '#ffffff' : 'var(--text-muted)',
                  border: `1px solid ${foodTypeFilter === cat.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status and Urgency toggle */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Status:</span>
              <select
                className="form-select"
                style={{ padding: '4px 10px', fontSize: '0.8rem', width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="available">🟢 Available Only</option>
                <option value="claimed">🟠 Claimed</option>
                <option value="picked_up">🚚 Picked Up</option>
                <option value="completed">🟣 Completed</option>
              </select>
            </div>

            {/* Urgency Highlight Toggle */}
            <button
              onClick={() => setUrgentOnly(!urgentOnly)}
              style={{
                background: urgentOnly ? 'rgba(244, 63, 94, 0.2)' : 'var(--bg-surface-elevated)',
                color: urgentOnly ? '#fb7185' : 'var(--text-muted)',
                border: `1px solid ${urgentOnly ? '#f43f5e' : 'var(--border-subtle)'}`,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <span>🔥 Expiring Soon (&lt;2h)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Donations */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Fetching real-time donations...
        </div>
      ) : donations.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '50px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <AlertCircle size={40} color="var(--text-dim)" />
          <h3 style={{ fontSize: '1.2rem' }}>No donations found matching criteria</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', fontSize: '0.88rem' }}>
            Try resetting your filters or search terms, or post a new food donation to see it appear live.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setFoodTypeFilter('all');
              setUrgentOnly(false);
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
            Showing <strong>{donations.length}</strong> donation {donations.length === 1 ? 'batch' : 'batches'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
            {donations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onClaim={onClaim}
                onViewDetails={onViewDetails}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
