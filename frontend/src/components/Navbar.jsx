import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header style={{
      height: '68px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 80
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-icon mobile-only" onClick={onToggleSidebar} style={{ display: 'none' }}>
          <Menu size={22} />
        </button>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          fontSize: '0.85rem'
        }}>
          <User size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontWeight: 600 }}>{user?.name}</span>
        </div>
        <button className="btn btn-sm btn-secondary" onClick={logout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
