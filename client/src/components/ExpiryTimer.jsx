import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle } from 'lucide-react';

export default function ExpiryTimer({ availableUntil, status = 'available' }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    function calculate() {
      if (status !== 'available') {
        setTimeLeft(status === 'completed' ? 'Completed' : 'Claimed');
        setIsCritical(false);
        return;
      }

      const diff = new Date(availableUntil).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Expired');
        setIsCritical(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours === 0 && minutes <= 60) {
        setIsCritical(true);
        setTimeLeft(`${minutes}m left`);
      } else if (hours < 3) {
        setIsCritical(true);
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setIsCritical(false);
        setTimeLeft(`${hours}h left`);
      }
    }

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [availableUntil, status]);

  if (status !== 'available') return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: isCritical ? '#f43f5e' : 'var(--text-muted)',
        background: isCritical ? 'rgba(244, 63, 94, 0.1)' : 'var(--bg-surface-elevated)',
        padding: '3px 8px',
        borderRadius: '6px',
        border: `1px solid ${isCritical ? 'rgba(244, 63, 94, 0.3)' : 'var(--border-subtle)'}`
      }}
    >
      {isCritical ? <AlertCircle size={13} /> : <Timer size={13} />}
      <span>{timeLeft}</span>
    </div>
  );
}
