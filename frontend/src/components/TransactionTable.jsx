import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Edit2, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-title">No transactions found</div>
        <p>Try adjusting your search filters or add new expenses/incomes.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Description</th>
            <th>Category / Source</th>
            <th>Details</th>
            <th>Amount</th>
            {(onEdit || onDelete) && <th style={{ textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isIncome = tx.type === 'INCOME';
            return (
              <tr key={`${tx.type}-${tx.id}`}>
                <td>
                  <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
                    {isIncome ? (
                      <>
                        <ArrowUpRight size={12} /> Income
                      </>
                    ) : (
                      <>
                        <ArrowDownLeft size={12} /> Expense
                      </>
                    )}
                  </span>
                </td>
                <td>{formatDate(tx.date)}</td>
                <td style={{ fontWeight: 600 }}>
                  {tx.description || <span style={{ color: 'var(--text-muted)' }}>-</span>}
                </td>
                <td>
                  <span className="badge badge-category">{tx.categoryOrSource}</span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {tx.detail || '-'}
                </td>
                <td style={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: isIncome ? 'var(--income-color)' : 'var(--expense-color)'
                }}>
                  {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>
                {(onEdit || onDelete) && (
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      {onEdit && (
                        <button className="btn-icon" onClick={() => onEdit(tx)} title="Edit">
                          <Edit2 size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button className="btn-icon" onClick={() => onDelete(tx)} title="Delete" style={{ color: 'var(--expense-color)' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
