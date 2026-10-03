import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Smartphone, Monitor, Sun, Moon, Sparkles, UserCheck, Shield } from 'lucide-react';

export default function QuickDemoBar() {
  const { user, demoUsers, quickSwitch, theme, toggleTheme, viewMode, toggleViewMode } = useAuth();

  return (
    <div
      style={{
        background: '#090d16',
        borderBottom: '1px solid #1f293d',
        color: '#e2e8f0',
        padding: '8px 16px',
        fontSize: '0.82rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        zIndex: 110,
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.04em'
          }}
        >
          WMD PROJECT
        </span>
        <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Sparkles size={13} color="#10b981" />
          Viva Demo Controller:
        </span>

        {/* 1-Click Role Switcher Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 0' }}>
          {demoUsers.map((dUser) => {
            const isActive = user && user.email === dUser.email;
            const isDonor = dUser.role === 'donor';
            const isNgo = dUser.role === 'ngo';
            const isAdmin = dUser.role === 'admin';

            let roleIcon = '👤';
            let roleColor = '#10b981';
            if (isDonor) { roleIcon = '🍛'; roleColor = '#10b981'; }
            if (isNgo) { roleIcon = '🤝'; roleColor = '#3b82f6'; }
            if (isAdmin) { roleIcon = '⚡'; roleColor = '#f59e0b'; }

            return (
              <button
                key={dUser.id}
                onClick={() => quickSwitch(dUser)}
                title={`Switch session to ${dUser.name} (${dUser.role.toUpperCase()})`}
                style={{
                  background: isActive ? roleColor : '#172033',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  border: `1px solid ${isActive ? roleColor : '#334155'}`,
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{roleIcon}</span>
                <span>{dUser.name.split(' ')[0]} ({dUser.role})</span>
                {isActive && <UserCheck size={11} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Device Mode Toggle: Web vs Mobile Simulator */}
        <button
          onClick={toggleViewMode}
          title={viewMode === 'responsive' ? 'Switch to Smartphone Screen Frame view' : 'Switch to Full Desktop view'}
          style={{
            background: viewMode === 'mobile_frame' ? 'rgba(59, 130, 246, 0.2)' : '#172033',
            color: viewMode === 'mobile_frame' ? '#60a5fa' : '#94a3b8',
            border: `1px solid ${viewMode === 'mobile_frame' ? '#3b82f6' : '#334155'}`,
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          {viewMode === 'mobile_frame' ? (
            <>
              <Monitor size={13} />
              <span>Full Web</span>
            </>
          ) : (
            <>
              <Smartphone size={13} />
              <span>Mobile Frame</span>
            </>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark / Light theme"
          style={{
            background: '#172033',
            color: '#cbd5e1',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {theme === 'dark' ? <Sun size={13} color="#f59e0b" /> : <Moon size={13} color="#818cf8" />}
        </button>

        {/* Backend Live Indicator */}
        <span
          title="Backend REST API: http://localhost:5000 connected"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.72rem',
            color: '#10b981'
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 6px #10b981'
            }}
          />
          API 5000
        </span>
      </div>
    </div>
  );
}
