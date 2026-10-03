import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HeartHandshake, 
  PlusCircle, 
  Menu, 
  X, 
  LogOut, 
  User, 
  ShieldCheck, 
  BarChart3, 
  Search,
  Package
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddDonation }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDonor = user?.role === 'donor';
  const isNgo = user?.role === 'ngo';
  const isAdmin = user?.role === 'admin';

  const handleNav = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="glass-nav" style={{ padding: '0 20px', height: '68px', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNav('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
            }}
          >
            🍱
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Food<span style={{ color: '#10b981' }}>Share</span>
              </span>
              <span 
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '1px 6px',
                  borderRadius: '12px'
                }}
              >
                LIVE
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '-3px' }}>
              Waste Less • Feed More
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="nav-links-desktop">
          <button
            onClick={() => handleNav('home')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: activeTab === 'home' ? 'var(--primary)' : 'var(--text-muted)',
              background: activeTab === 'home' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              transition: 'all 0.15s ease'
            }}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('explore')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: activeTab === 'explore' ? 'var(--primary)' : 'var(--text-muted)',
              background: activeTab === 'explore' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Search size={15} />
            Find Food
          </button>

          {/* Role Specific Links */}
          {isDonor && (
            <button
              onClick={() => handleNav('donor_dashboard')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: activeTab === 'donor_dashboard' ? 'var(--primary)' : 'var(--text-muted)',
                background: activeTab === 'donor_dashboard' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Package size={15} />
              My Donations
            </button>
          )}

          {isNgo && (
            <button
              onClick={() => handleNav('ngo_dashboard')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: activeTab === 'ngo_dashboard' ? '#3b82f6' : 'var(--text-muted)',
                background: activeTab === 'ngo_dashboard' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <HeartHandshake size={15} />
              My Claims
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNav('admin_dashboard')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: activeTab === 'admin_dashboard' ? '#f59e0b' : 'var(--text-muted)',
                background: activeTab === 'admin_dashboard' ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={15} />
              Admin Portal
            </button>
          )}

          <button
            onClick={() => handleNav('impact')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: activeTab === 'impact' ? 'var(--primary)' : 'var(--text-muted)',
              background: activeTab === 'impact' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BarChart3 size={15} />
            Impact
          </button>
        </div>

        {/* Right Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Donate button for donors & admins */}
          {(isDonor || isAdmin) && (
            <button
              onClick={onOpenAddDonation}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: '20px' }}
            >
              <PlusCircle size={15} />
              <span>Donate Food</span>
            </button>
          )}

          {/* User profile capsule */}
          {user ? (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-surface-elevated)',
                padding: '4px 10px 4px 4px',
                borderRadius: '24px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isDonor ? '#10b981' : isNgo ? '#3b82f6' : '#f59e0b',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                {user.name.charAt(0)}
              </div>
              <div style={{ lineHeight: 1.1, textAlign: 'left' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {user.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {user.role}
                </div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                style={{
                  marginLeft: '4px',
                  color: 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '3px'
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav('auth')}
              className="btn btn-secondary btn-sm"
            >
              <User size={14} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '8px',
              color: 'var(--text-main)'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
