import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, ShieldCheck, Receipt, TrendingUp, PieChart } from 'lucide-react';
import { authService } from '../services/authService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { formatDate } from '../utils/formatters';

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await authService.getUserProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to fetch user profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <LoadingSpinner text="Loading profile settings..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProfile} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Account Profile</h1>
          <p className="page-subtitle">Your personal account details and system activity summary</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* User Details Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #4f46e5 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800
            }}>
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>{profile?.name}</h2>
              <span className="badge badge-category" style={{ marginTop: '0.25rem' }}>
                <ShieldCheck size={12} style={{ marginRight: '0.2rem' }} /> Verified Member
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <Mail size={18} style={{ color: 'var(--accent-primary)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{profile?.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <Calendar size={18} style={{ color: 'var(--accent-primary)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Created</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{formatDate(profile?.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            System Records Overview
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Receipt size={18} style={{ color: 'var(--expense-color)' }} />
                <span style={{ fontWeight: 600 }}>Total Expense Records</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{profile?.totalExpensesCount || 0}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <TrendingUp size={18} style={{ color: 'var(--income-color)' }} />
                <span style={{ fontWeight: 600 }}>Total Income Records</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{profile?.totalIncomeCount || 0}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <PieChart size={18} style={{ color: 'var(--warning-color)' }} />
                <span style={{ fontWeight: 600 }}>Active Category Budgets</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{profile?.totalBudgetsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
