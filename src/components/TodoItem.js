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
    <div className={`card group transition-all duration-200 ${
      todo.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
    } ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
      
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
        // View Mode
        <div>
          <div className="flex items-start gap-4">
            {/* Toggle Button */}
            <button 
              onClick={handleToggle}
              disabled={isLoading}
              className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                todo.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
              } ${isLoading ? 'animate-pulse' : ''}`}
            >
              {todo.completed && <FiCheck size={14} />}
            </button>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-lg mb-2 transition-all duration-200 ${
                todo.completed 
                  ? 'text-gray-500 line-through' 
                  : 'text-gray-800'
              }`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`text-sm mb-3 leading-relaxed ${
                  todo.completed ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${
                  todo.completed 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                }`}>
                  {todo.completed ? <FiCheck size={10} /> : <FiClock size={10} />}
                  {todo.completed ? 'Completed' : 'Pending'}
                </span>
                
                <span className="inline-flex items-center gap-1 text-gray-500">
                  <FiCalendar size={10} />
                  {formatDate(todo.created_at)}
                </span>
                
                {todo.updated_at !== todo.created_at && (
                  <span className="inline-flex items-center gap-1 text-gray-500">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    Updated {formatDate(todo.updated_at)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                onClick={handleEdit}
                disabled={isLoading}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg
                           transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Edit todo"
              >
                <FiEdit2 size={14} />
              </button>
              <button 
                onClick={handleDelete}
                disabled={isLoading}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg
                           transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                title="Delete todo"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;