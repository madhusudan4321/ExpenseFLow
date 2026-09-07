import React from 'react';
import { Edit2, Trash2, Calendar, Wallet } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const IncomeList = ({ incomes, onEdit, onDelete }) => {
  if (!incomes || incomes.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-title">No income records</div>
        <p>Add your income sources to see your total earnings.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Source</th>
            <th>Description</th>
            <th>Amount</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} />
                  <span>{formatDate(income.date)}</span>
                </div>
              </td>
              <td>
                <span className="badge badge-income" style={{ textTransform: 'capitalize' }}>
                  <Wallet size={12} style={{ marginRight: '0.2rem' }} />
                  {income.source}
                </span>
              </td>
              <td style={{ fontWeight: 500 }}>
                {income.description || <span style={{ color: 'var(--text-muted)' }}>No description</span>}
              </td>
              <td style={{ fontWeight: 800, color: 'var(--income-color)', fontSize: '1rem' }}>
                +{formatCurrency(income.amount)}
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button className="btn-icon" onClick={() => onEdit(income)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-icon" onClick={() => onDelete(income.id)} title="Delete" style={{ color: 'var(--expense-color)' }}>
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
