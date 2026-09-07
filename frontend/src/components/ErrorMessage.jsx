import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;
  return (
    <div style={{
      background: 'var(--expense-light)',
      border: '1px solid rgba(244, 63, 94, 0.4)',
      color: 'var(--expense-color)',
      padding: '0.85rem 1.25rem',
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '1rem 0',
      fontSize: '0.9rem',
      fontWeight: '500'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <AlertCircle size={18} />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-sm btn-secondary" style={{ color: 'var(--expense-color)', borderColor: 'rgba(244, 63, 94, 0.4)' }}>
          Retry
        </button>
      )}
    </div>
  );
};
