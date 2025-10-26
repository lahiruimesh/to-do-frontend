import React from 'react';
import TodoItem from './TodoItem';
import { FiList, FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp, FiTarget } from 'react-icons/fi';

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
      <div className="glass-card animate-bounce-in text-center">
        <FiAlertCircle className="text-red-400 text-5xl mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
        <p className="text-white/70 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="glass-button bg-red-500/30 hover:bg-red-500/40 text-white px-6 py-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card group hover:scale-105 transition-all duration-300 border-blue-400/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors duration-300">
              <FiList className="text-blue-300 text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalCount}</div>
              <div className="text-white/60 text-sm font-medium">Total Tasks</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card group hover:scale-105 transition-all duration-300 border-yellow-400/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:bg-yellow-500/30 transition-colors duration-300">
              <FiClock className="text-yellow-300 text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{pendingCount}</div>
              <div className="text-white/60 text-sm font-medium">Pending</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card group hover:scale-105 transition-all duration-300 border-green-400/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors duration-300">
              <FiCheckCircle className="text-green-300 text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{completedCount}</div>
              <div className="text-white/60 text-sm font-medium">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="glass-card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FiTrendingUp className="text-white/70" />
            <h3 className="text-white font-semibold">Progress Overview</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/70">
                {completedCount} of {totalCount} tasks completed
              </span>
              <span className="text-green-300 font-bold">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FiTarget className="text-white/70" />
          <h3 className="text-white font-semibold">Filter Tasks</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => onFilterChange('all')}
            className={`glass-button py-3 text-sm font-medium transition-all duration-200 ${
              filter === 'all' 
                ? 'bg-blue-500/40 text-white border-blue-400/50 shadow-glow' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            All ({totalCount})
          </button>
          <button 
            onClick={() => onFilterChange('pending')}
            className={`glass-button py-3 text-sm font-medium transition-all duration-200 ${
              filter === 'pending' 
                ? 'bg-yellow-500/40 text-white border-yellow-400/50 shadow-glow' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button 
            onClick={() => onFilterChange('completed')}
            className={`glass-button py-3 text-sm font-medium transition-all duration-200 ${
              filter === 'completed' 
                ? 'bg-green-500/40 text-white border-green-400/50 shadow-glow' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Done ({completedCount})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && todos.length === 0 && (
        <div className="glass-card text-center py-12">
          <div className="animate-spin w-8 h-8 border-3 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-white/70">Loading your todos...</p>
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 && !isLoading ? (
          <div className="glass-card text-center py-16">
            {filter === 'all' ? (
              <div className="animate-bounce-in">
                <FiList className="text-white/40 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No todos yet</h3>
                <p className="text-white/60">Create your first todo to get started on your productivity journey!</p>
              </div>
            ) : filter === 'pending' ? (
              <div className="animate-bounce-in">
                <FiCheckCircle className="text-green-400/60 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">All caught up! 🎉</h3>
                <p className="text-white/60">Fantastic work! You've completed all your pending tasks.</p>
              </div>
            ) : (
              <div className="animate-bounce-in">
                <FiClock className="text-yellow-400/60 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No completed todos</h3>
                <p className="text-white/60">Complete some tasks to see your accomplishments here.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-slide-up"
              >
                <TodoItem
                  todo={todo}
                  onToggle={onToggleTodo}
                  onUpdate={onUpdateTodo}
                  onDelete={onDeleteTodo}
                  isLoading={isLoading}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;