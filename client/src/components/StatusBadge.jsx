import React from 'react';
import { CheckCircle2, Clock, Truck, Award, AlertTriangle } from 'lucide-react';

export default function StatusBadge({ status, isUrgent = false }) {
  const normalized = (status || 'available').toLowerCase();

  const configs = {
    available: {
      label: 'Available',
      icon: Clock,
      className: 'badge-available'
    },
    claimed: {
      label: 'Claimed',
      icon: Clock,
      className: 'badge-claimed'
    },
    picked_up: {
      label: 'Picked Up',
      icon: Truck,
      className: 'badge-picked_up'
    },
    completed: {
      label: 'Completed',
      icon: Award,
      className: 'badge-completed'
    },
    cancelled: {
      label: 'Cancelled',
      icon: AlertTriangle,
      className: 'badge-danger'
    }
  };

  const config = configs[normalized] || configs.available;
  const Icon = config.icon;

  return (
    <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
      <span className={`badge ${config.className}`}>
        <Icon size={12} strokeWidth={2.5} />
        {config.label}
      </span>
      {isUrgent && normalized === 'available' && (
        <span className="badge badge-urgent">
          <AlertTriangle size={12} />
          Expiring Soon
        </span>
      )}
    </div>
  );
}
