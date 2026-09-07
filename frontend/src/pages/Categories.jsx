import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { CategoryList } from '../components/CategoryList';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [formError, setFormError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to fetch expense categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!categoryName.trim()) {
      setFormError('Category name cannot be empty.');
      return;
    }

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, { name: categoryName.trim() });
      } else {
        await categoryService.create({ name: categoryName.trim() });
      }
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setFormError(err.response?.data?.message || 'Error saving category.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Linked expenses will be preserved.')) {
      try {
        await categoryService.delete(id);
        fetchCategories();
      } catch (err) {
        console.error('Failed to delete category:', err);
        alert(err.response?.data?.message || 'Error deleting category');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Category Management</h1>
          <p className="page-subtitle">Customize expense categories for budgeting and classification</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>New Category</span>
        </button>
      </div>

      <ErrorMessage message={error} onRetry={fetchCategories} />

      {loading ? (
        <LoadingSpinner text="Loading categories..." />
      ) : (
        <CategoryList
          categories={categories}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Rename Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit}>
          {formError && <div style={{ color: 'var(--expense-color)', fontSize: '0.85rem', marginBottom: '1rem' }}>{formError}</div>}

          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Subscriptions, Gaming, Books"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingCategory ? 'Save Name' : 'Create Category'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
