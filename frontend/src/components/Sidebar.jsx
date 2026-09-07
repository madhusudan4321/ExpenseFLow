import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingDown, 
  TrendingUp, 
  Receipt, 
  PieChart, 
  Tag, 
  User, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/expenses', label: 'Expenses', icon: TrendingDown },
    { path: '/income', label: 'Income', icon: TrendingUp },
    { path: '/transactions', label: 'Transactions', icon: Receipt },
    { path: '/budgets', label: 'Budgets', icon: PieChart },
    { path: '/categories', label: 'Categories', icon: Tag },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      {/* Brand */}
      <div style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
        }}>
          <Sparkles size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Expense<span style={{ color: 'var(--accent-primary)' }}>Flow</span>
          </h2>
          <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Finance & Budget MVP</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '1.25rem 0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.925rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'linear-gradient(135deg, var(--accent-primary) 0%, #4f46e5 100%)' : 'transparent',
                boxShadow: isActive ? '0 4px 14px rgba(99, 102, 241, 0.35)' : 'none',
                transition: 'var(--transition)'
              })}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer & Logout */}
      <div style={{
        padding: '1.25rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.name || 'User'}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.email}
          </p>
        </div>
        <button className="btn-icon" onClick={logout} title="Logout">
          <LogOut size={18} style={{ color: 'var(--expense-color)' }} />
        </button>
      </div>
    </aside>
  );
};
