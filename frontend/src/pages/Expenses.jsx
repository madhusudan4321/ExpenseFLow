import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import { ExpenseList } from '../components/ExpenseList';
import { ExpenseForm } from '../components/ExpenseForm';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [expenseData, categoryData] = await Promise.all([
        expenseService.getAll(),
        categoryService.getAll(),
      ]);
      setExpenses(expenseData);
      setCategories(categoryData);
    } catch (err) {
      console.error('Failed to load expenses:', err);
      setError('Failed to fetch expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingExpense) {
        await expenseService.update(editingExpense.id, formData);
      } else {
        await expenseService.create(formData);
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      console.error('Failed to save expense:', err);
      alert(err.response?.data?.message || 'Error saving expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await expenseService.delete(id);
        fetchData();
      } catch (err) {
        console.error('Failed to delete expense:', err);
        alert('Error deleting expense');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Expense Management</h1>
          <p className="page-subtitle">Track and manage your daily spending</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add Expense</span>
        </button>
      </div>

      <ErrorMessage message={error} onRetry={fetchData} />

      {loading ? (
        <LoadingSpinner text="Loading expenses..." />
      ) : (
        <ExpenseList
          expenses={expenses}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
      >
        <ExpenseForm
          initialData={editingExpense}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};
