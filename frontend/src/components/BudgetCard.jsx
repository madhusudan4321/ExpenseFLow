import React from 'react';
import { Edit2, Trash2, PieChart } from 'lucide-react';
import { formatCurrency, formatMonthYear } from '../utils/formatters';

export const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const percentage = Math.min(budget.percentageUsed || 0, 100);
  const isOverBudget = (budget.spent || 0) > budget.amount;
  const isHighWarning = percentage >= 85 && !isOverBudget;

  let progressColor = 'var(--accent-primary)';
  if (isOverBudget) {
    progressColor = 'var(--expense-color)';
  } else if (isHighWarning) {
    progressColor = 'var(--warning-color)';
  }

  return (
    <div className="card" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-primary-light)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PieChart size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {budget.categoryName}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {formatMonthYear(budget.month, budget.year)}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button className="btn-icon" onClick={() => onEdit(budget)} title="Edit Budget">
            <Edit2 size={16} />
          </button>
          <button className="btn-icon" onClick={() => onDelete(budget.id)} title="Delete Budget" style={{ color: 'var(--expense-color)' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Spent: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(budget.spent)}</strong>
        </span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Budget: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(budget.amount)}</strong>
        </span>
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${percentage}%`,
            background: progressColor
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.85rem' }}>
        <span style={{ color: isOverBudget ? 'var(--expense-color)' : 'var(--text-muted)' }}>
          {isOverBudget
            ? `Over by ${formatCurrency(budget.spent - budget.amount)}`
            : `Remaining: ${formatCurrency(budget.remaining)}`}
        </span>
        <span className={`badge ${isOverBudget ? 'badge-expense' : 'badge-category'}`}>
          {budget.percentageUsed}% used
        </span>
      </div>
    </div>
  );
};
