import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart as PieIcon, 
  Plus, 
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { SummaryCard } from '../components/SummaryCard';
import { TransactionTable } from '../components/TransactionTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { formatCurrency } from '../utils/formatters';

const CATEGORY_COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const summary = await dashboardService.getSummary();
      setData(summary);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load financial dashboard. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner text="Loading financial overview..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />;

  // Transform Category Data for PieChart
  const pieData = data?.categoryExpenses
    ? Object.keys(data.categoryExpenses).map((key) => ({
        name: key,
        value: Number(data.categoryExpenses[key]),
      }))
    : [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Dashboard</h1>
          <p className="page-subtitle">Real-time breakdown of your earnings, spending, and budgets</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/expenses" className="btn btn-primary" style={{ background: 'var(--expense-color)' }}>
            <Plus size={18} />
            <span>Add Expense</span>
          </Link>
          <Link to="/income" className="btn btn-primary" style={{ background: 'var(--income-color)' }}>
            <Plus size={18} />
            <span>Add Income</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Total Income"
          amount={formatCurrency(data?.totalIncome)}
          subtext="Lifetime earnings"
          icon={TrendingUp}
          color="var(--income-color)"
          bg="var(--income-light)"
        />
        <SummaryCard
          title="Total Expenses"
          amount={formatCurrency(data?.totalExpenses)}
          subtext="Lifetime spending"
          icon={TrendingDown}
          color="var(--expense-color)"
          bg="var(--expense-light)"
        />
        <SummaryCard
          title="Current Balance"
          amount={formatCurrency(data?.currentBalance)}
          subtext="Net financial balance"
          icon={Wallet}
          color="var(--accent-primary)"
          bg="var(--accent-primary-light)"
        />
        <SummaryCard
          title="Current Month Budget"
          amount={formatCurrency(data?.currentMonthBudgetTotal)}
          subtext={`Spent: ${formatCurrency(data?.currentMonthSpending)} | Rem: ${formatCurrency(data?.currentMonthBudgetRemaining)}`}
          icon={PieIcon}
          color="var(--warning-color)"
          bg="var(--warning-light)"
        />
      </div>

      {/* Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Income vs Expense Bar Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Income vs Expense (Past 6 Months)
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data?.monthlyComparison || []}>
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="income" fill="var(--income-color)" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="var(--expense-color)" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense by Category Pie Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Expense Distribution by Category
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p>No expense categories recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Feed */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Transactions</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Latest income & expense records</p>
          </div>
          <Link to="/transactions" className="btn btn-sm btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <TransactionTable transactions={data?.recentTransactions || []} />
      </div>
    </div>
  );
};
