import React, { useState } from 'react';

const INCOME_SOURCES = ['Salary', 'Freelancing', 'Business', 'Investment', 'Bonus', 'Other'];

export const IncomeForm = ({ initialData, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [source, setSource] = useState(initialData?.source || 'Salary');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }
    setError('');

    onSubmit({
      amount: parseFloat(amount),
      source,
      description,
      date,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'var(--expense-color)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}
      
      <div className="form-group">
        <label className="form-label">Amount (₹)</label>
        <input
          type="number"
          step="0.01"
          className="form-input"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Income Source</label>
          <select
            className="form-select"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            {INCOME_SOURCES.map((src) => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description (Optional)</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Monthly Salary payment"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update Income' : 'Add Income'}</button>
      </div>
    </form>
  );
};
