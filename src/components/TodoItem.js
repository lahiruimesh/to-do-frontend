import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiX, FiSave } from 'react-icons/fi';
import './TodoItem.css';

const TodoItem = ({ todo, onToggle, onUpdate, onDelete, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || ''
  });
  const [errors, setErrors] = useState({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: todo.title,
      description: todo.description || ''
    });
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: todo.title,
      description: todo.description || ''
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
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

  const validateEdit = () => {
    const newErrors = {};
    
    if (!editData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (editData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }
    
    if (editData.description && editData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateEdit()) {
      return;
    }

    try {
      const updatedData = {
        title: editData.title.trim(),
        description: editData.description.trim() || undefined
      };

      await onUpdate(todo.id, updatedData);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const handleToggle = () => {
    onToggle(todo.id, !todo.completed);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      onDelete(todo.id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : 'pending'} ${isLoading ? 'loading' : ''}`}>
      {isEditing ? (
        <div className="edit-mode">
          <div className="edit-form">
            <div className="form-group">
              <input
                name="title"
                type="text"
                value={editData.title}
                onChange={handleChange}
                placeholder="Todo title..."
                className={errors.title ? 'error' : ''}
                maxLength={255}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            
            <div className="form-group">
              <textarea
                name="description"
                value={editData.description}
                onChange={handleChange}
                placeholder="Description (optional)..."
                rows={2}
                className={errors.description ? 'error' : ''}
                maxLength={1000}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            
            {errors.submit && (
              <div className="error-message submit-error">{errors.submit}</div>
            )}
          </div>
          
          <div className="edit-actions">
            <button 
              onClick={handleSave} 
              className="save-btn"
              disabled={!editData.title.trim()}
            >
              <FiSave /> Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              <FiX /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <div className="todo-content">
            <div className="todo-main">
              <button 
                onClick={handleToggle}
                className={`toggle-btn ${todo.completed ? 'completed' : ''}`}
                disabled={isLoading}
              >
                {todo.completed && <FiCheck />}
              </button>
              
              <div className="todo-text">
                <h3 className="todo-title">{todo.title}</h3>
                {todo.description && (
                  <p className="todo-description">{todo.description}</p>
                )}
                <div className="todo-meta">
                  <span className="todo-status">
                    Status: <strong>{todo.completed ? 'Completed' : 'Pending'}</strong>
                  </span>
                  <span className="todo-date">
                    Created: {formatDate(todo.created_at)}
                  </span>
                  {todo.updated_at !== todo.created_at && (
                    <span className="todo-date">
                      Updated: {formatDate(todo.updated_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="todo-actions">
              <button 
                onClick={handleEdit}
                className="edit-btn"
                disabled={isLoading}
                title="Edit todo"
              >
                <FiEdit2 />
              </button>
              <button 
                onClick={handleDelete}
                className="delete-btn"
                disabled={isLoading}
                title="Delete todo"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;