import React from 'react';
import { Edit2, Trash2, Calendar, Tag, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-title">No expenses recorded</div>
        <p>Add your first expense to start tracking your spending.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Payment Method</th>
            <th>Amount</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} />
                  <span>{formatDate(expense.date)}</span>
                </div>
              </td>
              <td>
                <span className="badge badge-category">
                  {expense.categoryName || 'Uncategorized'}
                </span>
              </td>
              <td style={{ fontWeight: 500 }}>
                {expense.description || <span style={{ color: 'var(--text-muted)' }}>No description</span>}
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <CreditCard size={14} />
                  <span>{expense.paymentMethod}</span>
                </div>
              </td>
              <td style={{ fontWeight: 800, color: 'var(--expense-color)', fontSize: '1rem' }}>
                -{formatCurrency(expense.amount)}
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button className="btn-icon" onClick={() => onEdit(expense)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-icon" onClick={() => onDelete(expense.id)} title="Delete" style={{ color: 'var(--expense-color)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
