import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { incomeService } from '../services/incomeService';
import { categoryService } from '../services/categoryService';
import { TransactionTable } from '../components/TransactionTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Modal } from '../components/Modal';
import { ExpenseForm } from '../components/ExpenseForm';
import { IncomeForm } from '../components/IncomeForm';

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL, INCOME, EXPENSE
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('DATE_DESC'); // DATE_DESC, DATE_ASC, AMOUNT_DESC, AMOUNT_ASC

  // Edit Modal State
  const [editTx, setEditTx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [expenses, incomes, categoryList] = await Promise.all([
        expenseService.getAll(),
        incomeService.getAll(),
        categoryService.getAll(),
      ]);

      const txList = [];
      expenses.forEach((e) => {
        txList.push({
          id: e.id,
          type: 'EXPENSE',
          amount: e.amount,
          description: e.description,
          categoryOrSource: e.categoryName || 'Uncategorized',
          detail: e.paymentMethod,
          date: e.date,
          createdAt: e.createdAt,
          raw: e,
        });
      });

      incomes.forEach((i) => {
        txList.push({
          id: i.id,
          type: 'INCOME',
          amount: i.amount,
          description: i.description,
          categoryOrSource: i.source,
          detail: i.source,
          date: i.date,
          createdAt: i.createdAt,
          raw: i,
        });
      });

      setTransactions(txList);
      setCategories(categoryList);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Failed to fetch transaction ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter & Sort Logic
  const filteredTransactions = transactions.filter((tx) => {
    // Type Filter
    if (typeFilter !== 'ALL' && tx.type !== typeFilter) return false;

    // Category/Source Filter
    if (categoryFilter !== 'ALL' && tx.categoryOrSource !== categoryFilter) return false;

    // Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchDesc = tx.description?.toLowerCase().includes(query);
      const matchCat = tx.categoryOrSource?.toLowerCase().includes(query);
      const matchAmount = tx.amount.toString().includes(query);
      if (!matchDesc && !matchCat && !matchAmount) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortOrder === 'DATE_DESC') return new Date(b.date) - new Date(a.date);
    if (sortOrder === 'DATE_ASC') return new Date(a.date) - new Date(b.date);
    if (sortOrder === 'AMOUNT_DESC') return b.amount - a.amount;
    if (sortOrder === 'AMOUNT_ASC') return a.amount - b.amount;
    return 0;
  });

  const handleEdit = (tx) => {
    setEditTx(tx);
    setIsModalOpen(true);
  };

  const handleDelete = async (tx) => {
    if (window.confirm(`Are you sure you want to delete this ${tx.type.toLowerCase()} record?`)) {
      try {
        if (tx.type === 'EXPENSE') {
          await expenseService.delete(tx.id);
        } else {
          await incomeService.delete(tx.id);
        }
        fetchData();
      } catch (err) {
        console.error('Error deleting transaction:', err);
        alert('Failed to delete transaction.');
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editTx.type === 'EXPENSE') {
        await expenseService.update(editTx.id, formData);
      } else {
        await incomeService.update(editTx.id, formData);
      }
      setIsModalOpen(false);
      setEditTx(null);
      fetchData();
    } catch (err) {
      console.error('Failed to update transaction:', err);
      alert('Error updating transaction.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Unified Transactions Ledger</h1>
          <p className="page-subtitle">Search, filter, and audit all financial movement</p>
        </div>
      </div>

      <ErrorMessage message={error} onRetry={fetchData} />

      {/* Filter Controls Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search description or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="EXPENSE">Expenses Only</option>
              <option value="INCOME">Income Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories & Sources</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={18} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="DATE_DESC">Date (Newest First)</option>
              <option value="DATE_ASC">Date (Oldest First)</option>
              <option value="AMOUNT_DESC">Amount (High to Low)</option>
              <option value="AMOUNT_ASC">Amount (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading transaction ledger..." />
      ) : (
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editTx ? `Edit ${editTx.type === 'EXPENSE' ? 'Expense' : 'Income'}` : 'Edit Transaction'}
      >
        {editTx?.type === 'EXPENSE' ? (
          <ExpenseForm
            initialData={{
              amount: editTx.raw.amount,
              description: editTx.raw.description,
              categoryId: editTx.raw.categoryId,
              date: editTx.raw.date,
              paymentMethod: editTx.raw.paymentMethod,
            }}
            categories={categories}
            onSubmit={handleModalSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <IncomeForm
            initialData={{
              amount: editTx?.raw.amount,
              source: editTx?.raw.source,
              description: editTx?.raw.description,
              date: editTx?.raw.date,
            }}
            onSubmit={handleModalSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};
