import React from 'react';
import { Tag, Edit2, Trash2 } from 'lucide-react';

export const CategoryList = ({ categories, onEdit, onDelete }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-title">No categories found</div>
        <p>Create custom categories to organize your expenses.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
      {categories.map((cat) => (
        <div key={cat.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary-light)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Tag size={18} />
            </div>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button className="btn-icon" onClick={() => onEdit(cat)} title="Rename">
              <Edit2 size={16} />
            </button>
            <button className="btn-icon" onClick={() => onDelete(cat.id)} title="Delete" style={{ color: 'var(--expense-color)' }}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
