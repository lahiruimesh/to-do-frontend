import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import './TodoForm.css';

const TodoForm = ({ onAddTodo, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }
    
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onAddTodo({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined
      });
      
      // Reset form on success
      setFormData({ title: '', description: '' });
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Todo Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter todo title..."
          className={errors.title ? 'error' : ''}
          disabled={isLoading}
          maxLength={255}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description..."
          rows={3}
          className={errors.description ? 'error' : ''}
          disabled={isLoading}
          maxLength={1000}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
        <small className="char-count">
          {formData.description.length}/1000 characters
        </small>
      </div>

      {errors.submit && (
        <div className="error-message submit-error">{errors.submit}</div>
      )}

      <button 
        type="submit" 
        className="add-btn"
        disabled={isLoading || !formData.title.trim()}
      >
        <FiPlus /> 
        {isLoading ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
};

export default TodoForm;