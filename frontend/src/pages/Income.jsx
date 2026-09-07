import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { incomeService } from '../services/incomeService';
import { IncomeList } from '../components/IncomeList';
import { IncomeForm } from '../components/IncomeForm';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  const fetchIncome = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await incomeService.getAll();
      setIncomes(data);
    } catch (err) {
      console.error('Failed to load income:', err);
      setError('Failed to fetch income records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleOpenAddModal = () => {
    setEditingIncome(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (income) => {
    setEditingIncome(income);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingIncome) {
        await incomeService.update(editingIncome.id, formData);
      } else {
        await incomeService.create(formData);
      }
      handleCloseModal();
      fetchIncome();
    } catch (err) {
      console.error('Failed to save income:', err);
      alert(err.response?.data?.message || 'Error saving income');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await incomeService.delete(id);
        fetchIncome();
      } catch (err) {
        console.error('Failed to delete income:', err);
        alert('Error deleting income');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Income Management</h1>
          <p className="page-subtitle">Track salary, freelancing, and other revenue streams</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ background: 'var(--income-color)' }}>
          <Plus size={18} />
          <span>Add Income</span>
        </button>
      </div>

      <ErrorMessage message={error} onRetry={fetchIncome} />

      {loading ? (
        <LoadingSpinner text="Loading income records..." />
      ) : (
        <IncomeList
          incomes={incomes}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingIncome ? 'Edit Income' : 'Add New Income'}
      >
        <IncomeForm
          initialData={editingIncome}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};
