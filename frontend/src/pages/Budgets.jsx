import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { budgetService } from '../services/budgetService';
import { categoryService } from '../services/categoryService';
import { BudgetCard } from '../components/BudgetCard';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' }, { value: 4, label: 'April' },
  { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' },
  { value: 9, label: 'September' }, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' }
];

export const Budgets = () => {
  const currentDate = new Date();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter Month / Year
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  // Form State
  const [formAmount, setFormAmount] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formMonth, setFormMonth] = useState(currentDate.getMonth() + 1);
  const [formYear, setFormYear] = useState(currentDate.getFullYear());
  const [formError, setFormError] = useState('');

  const fetchBudgets = async () => {
    setLoading(true);
    setError('');
    try {
      const [budgetData, categoryData] = await Promise.all([
        budgetService.getAll(selectedMonth, selectedYear),
        categoryService.getAll(),
      ]);
      setBudgets(budgetData);
      setCategories(categoryData);
      if (categoryData.length > 0 && !formCategoryId) {
        setFormCategoryId(categoryData[0].id);
      }
    } catch (err) {
      console.error('Failed to load budgets:', err);
      setError('Failed to fetch monthly budgets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  const handleOpenAddModal = () => {
    setEditingBudget(null);
    setFormAmount('');
    if (categories.length > 0) setFormCategoryId(categories[0].id);
    setFormMonth(selectedMonth);
    setFormYear(selectedYear);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (budget) => {
    setEditingBudget(budget);
    setFormAmount(budget.amount);
    setFormCategoryId(budget.categoryId);
    setFormMonth(budget.month);
    setFormYear(budget.year);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formAmount || parseFloat(formAmount) <= 0) {
      setFormError('Budget amount must be greater than 0.');
      return;
    }
    if (!formCategoryId) {
      setFormError('Category is required.');
      return;
    }

    try {
      const payload = {
        amount: parseFloat(formAmount),
        categoryId: parseInt(formCategoryId),
        month: parseInt(formMonth),
        year: parseInt(formYear),
      };

      if (editingBudget) {
        await budgetService.update(editingBudget.id, payload);
      } else {
        await budgetService.create(payload);
      }
      handleCloseModal();
      fetchBudgets();
    } catch (err) {
      console.error('Error saving budget:', err);
      setFormError(err.response?.data?.message || 'Error saving budget limit.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category budget?')) {
      try {
        await budgetService.delete(id);
        fetchBudgets();
      } catch (err) {
        console.error('Failed to delete budget:', err);
        alert('Error deleting budget');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Monthly Budgets</h1>
          <p className="page-subtitle">Set category spending limits and monitor usage</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Create Budget</span>
        </button>
      </div>

      <ErrorMessage message={error} onRetry={fetchBudgets} />

      {/* Month & Year Selection Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Period:</span>
          </div>

          <select
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            style={{ width: 'auto' }}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ width: 'auto' }}
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Calculating budget metrics..." />
      ) : budgets.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-title">No budgets set for this period</div>
          <p>Create a monthly category budget to prevent overspending.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? 'Edit Budget' : 'Create Category Budget'}
      >
        <form onSubmit={handleSubmit}>
          {formError && <div style={{ color: 'var(--expense-color)', fontSize: '0.85rem', marginBottom: '1rem' }}>{formError}</div>}

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formCategoryId}
              onChange={(e) => setFormCategoryId(e.target.value)}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Limit Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="e.g. 8000"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Month</label>
              <select
                className="form-select"
                value={formMonth}
                onChange={(e) => setFormMonth(parseInt(e.target.value))}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <select
                className="form-select"
                value={formYear}
                onChange={(e) => setFormYear(parseInt(e.target.value))}
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingBudget ? 'Update Budget' : 'Set Budget'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
