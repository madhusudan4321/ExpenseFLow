import React, { useState, useEffect } from 'react';

const PAYMENT_METHODS = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];

export const ExpenseForm = ({ initialData, categories, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || (categories[0]?.id || ''));
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod || 'UPI');
  const [error, setError] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (!categoryId) {
      setError('Please select a category');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }
    setError('');

    onSubmit({
      amount: parseFloat(amount),
      description,
      categoryId: parseInt(categoryId),
      date,
      paymentMethod,
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
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <select
            className="form-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm} value={pm}>{pm}</option>
            ))}
          </select>
        </div>
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

      <div className="form-group">
        <label className="form-label">Description (Optional)</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Grocery shopping at DMart"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update Expense' : 'Add Expense'}</button>
      </div>
    </form>
  );
};
