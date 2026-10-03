import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import QuickDemoBar from './components/QuickDemoBar';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ImpactPage from './pages/ImpactPage';
import AuthPage from './pages/AuthPage';

import AddDonationModal from './components/AddDonationModal';
import ClaimModal from './components/ClaimModal';
import DonationDetailsModal from './components/DonationDetailsModal';
import { claimsApi } from './api';

function MainApp() {
  const { user, viewMode } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [claimModalData, setClaimModalData] = useState(null);
  const [detailsDonationId, setDetailsDonationId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleOpenClaim = (donation) => {
    if (!user) {
      setActiveTab('auth');
      showToast('Please sign in as an NGO or Admin to claim food');
      return;
    }
    setClaimModalData(donation);
  };

  const handleViewDetails = (donation) => {
    setDetailsDonationId(donation.id);
  };

  const handleUpdateStatus = async (claimId, newStatus) => {
    try {
      await claimsApi.updateStatus(claimId, newStatus);
      showToast(`Status updated to ${newStatus === 'picked_up' ? 'Picked Up 🚚' : 'Delivered & Completed 🎉'}`);
      // trigger rerender
      setActiveTab((prev) => prev);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Render current page content
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            onOpenAddDonation={() => setIsAddModalOpen(true)}
            onViewDetails={handleViewDetails}
            onClaim={handleOpenClaim}
            onUpdateStatus={handleUpdateStatus}
            setActiveTab={setActiveTab}
          />
        );
      case 'explore':
        return (
          <ExplorePage
            onClaim={handleOpenClaim}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            onOpenAddDonation={() => setIsAddModalOpen(true)}
          />
        );
      case 'donor_dashboard':
        return (
          <DonorDashboard
            onOpenAddDonation={() => setIsAddModalOpen(true)}
            onViewDetails={handleViewDetails}
            onClaim={handleOpenClaim}
            onUpdateStatus={handleUpdateStatus}
          />
        );
      case 'ngo_dashboard':
        return (
          <NgoDashboard
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            setActiveTab={setActiveTab}
          />
        );
      case 'admin_dashboard':
        return <AdminDashboard onViewDetails={handleViewDetails} />;
      case 'impact':
        return <ImpactPage />;
      case 'auth':
        return <AuthPage onSuccess={() => setActiveTab('home')} />;
      default:
        return (
          <HomePage
            onOpenAddDonation={() => setIsAddModalOpen(true)}
            onViewDetails={handleViewDetails}
            onClaim={handleOpenClaim}
            onUpdateStatus={handleUpdateStatus}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  const AppContent = (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddDonation={() => setIsAddModalOpen(true)}
      />

      <main style={{ minHeight: 'calc(100vh - 160px)' }}>{renderContent()}</main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '30px 20px',
          background: 'var(--bg-surface)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-dim)'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>FoodShare Platform</span>
            <span>•</span>
            <span>Web and Mobile Development (WMD) Laboratory Project</span>
          </div>
          <div>
            Built with <strong>React + Vite + Node.js Express + SQLite3</strong> • Designed for zero-waste community nutrition.
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Developed by Kartik Mahindrakar • Mumbai University WMD Syllabus Implementation
          </div>
        </div>
      </footer>
    </>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Demo Switcher & Controller */}
      <QuickDemoBar />

      {/* View Mode Switching: Responsive Web or Simulated Smartphone Bezel */}
      {viewMode === 'mobile_frame' ? (
        <div className="device-frame-container">
          <div className="smartphone-frame">
            <div className="smartphone-notch">
              <div className="notch-speaker" />
              <div className="notch-camera" />
            </div>
            <div className="smartphone-screen">{AppContent}</div>
          </div>
        </div>
      ) : (
        AppContent
      )}

      {/* Toast Notification Notification Pill */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--primary)',
            color: 'var(--text-main)',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999,
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add Donation Modal */}
      <AddDonationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={() => {
          showToast('Food Donation published successfully! 🚀');
          if (activeTab === 'donor_dashboard' || activeTab === 'explore') {
            setActiveTab((prev) => prev);
          } else {
            setActiveTab('explore');
          }
        }}
      />

      {/* Claim Modal */}
      <ClaimModal
        donation={claimModalData}
        isOpen={!!claimModalData}
        onClose={() => setClaimModalData(null)}
        onClaimed={() => {
          showToast('Donation claimed! Vehicle pickup coordinated. 🤝');
          setActiveTab('ngo_dashboard');
        }}
      />

      {/* Donation Details Modal */}
      <DonationDetailsModal
        donationId={detailsDonationId}
        isOpen={!!detailsDonationId}
        onClose={() => setDetailsDonationId(null)}
        onRefresh={() => setActiveTab((prev) => prev)}
        onClaimRequested={(d) => handleOpenClaim(d)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
