import React from 'react';
import TodoItem from './TodoItem';
import { FiList, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import './TodoList.css';

const TodoList = ({ 
  todos, 
  onToggleTodo, 
  onUpdateTodo, 
  onDeleteTodo, 
  filter, 
  onFilterChange,
  isLoading,
  error 
}) => {
  const getFilteredTodos = () => {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'pending':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;
  const totalCount = todos.length;

  if (error) {
    return (
      <div className="todo-list-error">
        <FiAlertCircle className="error-icon" />
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      {/* Statistics */}
      <div className="todo-stats">
        <div className="stat-item total">
          <FiList className="stat-icon" />
          <div className="stat-content">
            <span className="stat-number">{totalCount}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-item pending">
          <FiClock className="stat-icon" />
          <div className="stat-content">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-item completed">
          <FiCheckCircle className="stat-icon" />
          <div className="stat-content">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="todo-filters">
        <button 
          onClick={() => onFilterChange('all')}
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          All ({totalCount})
        </button>
        <button 
          onClick={() => onFilterChange('pending')}
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
        >
          Pending ({pendingCount})
        </button>
        <button 
          onClick={() => onFilterChange('completed')}
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Loading State */}
      {isLoading && todos.length === 0 && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading todos...</p>
        </div>
      )}

      {/* Todo List */}
      <div className="todo-list">
        {filteredTodos.length === 0 && !isLoading ? (
          <div className="empty-state">
            {filter === 'all' ? (
              <>
                <FiList className="empty-icon" />
                <h3>No todos yet</h3>
                <p>Create your first todo to get started!</p>
              </>
            ) : filter === 'pending' ? (
              <>
                <FiClock className="empty-icon" />
                <h3>No pending todos</h3>
                <p>Great job! You've completed all your tasks.</p>
              </>
            ) : (
              <>
                <FiCheckCircle className="empty-icon" />
                <h3>No completed todos</h3>
                <p>Complete some todos to see them here.</p>
              </>
            )}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggleTodo}
              onUpdate={onUpdateTodo}
              onDelete={onDeleteTodo}
              isLoading={isLoading}
            />
          ))
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">
              Progress: {completedCount} of {totalCount} completed
            </span>
            <span className="progress-percentage">
              {Math.round((completedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;