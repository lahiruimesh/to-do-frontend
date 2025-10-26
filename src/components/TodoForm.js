import React, { useState } from 'react';
import { FiPlus, FiLoader } from 'react-icons/fi';

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
    <div className="glass-card animate-slide-up">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          Add New Todo
        </h3>
        <p className="text-white/70 text-sm">Create a new task to stay organized</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label 
            htmlFor="title" 
            className="block text-sm font-semibold text-white/90"
          >
            Todo Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter your todo title..."
            className={`glass-input w-full ${
              errors.title 
                ? 'border-red-400/50 bg-red-50/10 focus:ring-red-400/50' 
                : 'border-white/30 focus:border-blue-400/50'
            }`}
            disabled={isLoading}
            maxLength={255}
          />
          {errors.title && (
            <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
              {errors.title}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="description" 
            className="block text-sm font-semibold text-white/90"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add more details about your todo..."
            rows={3}
            className={`glass-input w-full resize-none ${
              errors.description 
                ? 'border-red-400/50 bg-red-50/10 focus:ring-red-400/50' 
                : 'border-white/30 focus:border-blue-400/50'
            }`}
            disabled={isLoading}
            maxLength={1000}
          />
          {errors.description && (
            <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
              {errors.description}
            </p>
          )}
          <div className="flex justify-between items-center">
            <small className="text-white/50 text-xs">
              {formData.description.length}/1000 characters
            </small>
          </div>
        </div>

        {errors.submit && (
          <div className="glass-light border-red-400/30 bg-red-50/10 rounded-lg p-3">
            <p className="text-red-300 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              {errors.submit}
            </p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading || !formData.title.trim()}
          className={`glass-button w-full flex items-center justify-center gap-3 py-4 text-white font-semibold
            ${isLoading || !formData.title.trim() 
              ? 'opacity-50 cursor-not-allowed bg-gray-500/20' 
              : 'bg-gradient-to-r from-blue-500/30 to-purple-600/30 hover:from-blue-500/40 hover:to-purple-600/40 hover:shadow-glow'
            } transition-all duration-300`}
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin" />
              Creating Todo...
            </>
          ) : (
            <>
              <FiPlus className="text-lg" />
              Add Todo
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;