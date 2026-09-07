import React from 'react';

export const SummaryCard = ({ title, amount, subtext, icon: Icon, color = 'var(--accent-primary)', bg = 'var(--accent-primary-light)' }) => {
  return (
    <div className="card summary-card">
      <div className="summary-icon-wrapper" style={{ background: bg, color: color }}>
        {Icon && <Icon size={26} />}
      </div>
      <div className="summary-info">
        <span className="label">{title}</span>
        <div className="value">{amount}</div>
        {subtext && <div className="subtext">{subtext}</div>}
      </div>
    </div>
  );
};
