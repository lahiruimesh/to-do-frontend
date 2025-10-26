import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiX, FiSave, FiClock, FiCalendar } from 'react-icons/fi';

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
    <div className={`relative group overflow-hidden bg-gradient-to-br from-white to-gray-50/30 
                    rounded-xl border border-gray-200/70 shadow-sm backdrop-blur-sm
                    transition-all duration-300 ease-out hover:shadow-xl hover:shadow-blue-100/50 
                    hover:-translate-y-1 hover:border-blue-300/50 hover:bg-gradient-to-br hover:from-blue-50/30 hover:to-white
                    ${isLoading ? 'opacity-60 pointer-events-none' : ''}
                    ${isEditing ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-100/50' : ''}`}>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70"></div>
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl group-hover:from-blue-400/20 group-hover:to-purple-400/20 transition-all duration-300"></div>
      
      <div className="relative p-6">
      
      {isEditing ? (
        // Edit Mode
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 className="text-gray-800 font-semibold">Editing Todo</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <input
                name="title"
                type="text"
                value={editData.title}
                onChange={handleChange}
                placeholder="Todo title..."
                className={`input-field ${
                  errors.title 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : ''
                }`}
                maxLength={255}
              />
              {errors.title && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.title}
                </p>
              )}
            </div>
            
            <div>
              <textarea
                name="description"
                value={editData.description}
                onChange={handleChange}
                placeholder="Description (optional)..."
                rows={2}
                className={`input-field resize-none ${
                  errors.description 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : ''
                }`}
                maxLength={1000}
              />
              {errors.description && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.description}
                </p>
              )}
            </div>
            
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <button 
              onClick={handleSave} 
              disabled={!editData.title.trim()}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                         transition-colors duration-200"
            >
              <FiSave size={16} />
              Save
            </button>
            <button 
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg
                         flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <FiX size={16} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // View Mode - Only showing pending tasks
        <div>
          <div className="flex items-start gap-4">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className="text-sm mb-4 leading-relaxed text-gray-600 bg-gray-50/50 p-3 rounded-lg border-l-4 border-blue-200">
                  {todo.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-medium bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-200/50 shadow-sm">
                  <FiClock size={12} />
                  Pending
                </span>
                
                <span className="inline-flex items-center gap-2 text-gray-500 bg-white/60 px-3 py-1.5 rounded-full border border-gray-200/50 shadow-sm">
                  <FiCalendar size={12} />
                  {formatDate(todo.created_at)}
                </span>
                
                {todo.updated_at !== todo.created_at && (
                  <span className="inline-flex items-center gap-2 text-gray-500 bg-white/60 px-3 py-1.5 rounded-full border border-gray-200/50 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                    Updated {formatDate(todo.updated_at)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
              <button 
                onClick={handleEdit}
                disabled={isLoading}
                className="p-3 text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 
                           rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 
                           transform hover:scale-105 shadow-sm hover:shadow-md"
                title="Edit task"
              >
                <FiEdit2 size={16} />
              </button>
              
              <button 
                onClick={handleToggle}
                disabled={isLoading}
                className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 
                           text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl 
                           transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400/50
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 
                           transform hover:scale-105 hover:-translate-y-0.5"
                title="Mark as completed"
              >
                <FiCheck size={14} />
                Done
              </button>
              
              <button 
                onClick={handleDelete}
                disabled={isLoading}
                className="p-3 text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 
                           rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400/50 
                           transform hover:scale-105 shadow-sm hover:shadow-md"
                title="Delete task"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default TodoItem;