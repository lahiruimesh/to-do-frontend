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
      <div className="card text-center p-8">
        <FiAlertCircle className="text-red-500 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary px-6 py-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4 border-blue-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FiList className="text-blue-600 text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
              <div className="text-gray-600 text-sm font-medium">Total Tasks</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4 border-orange-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <FiClock className="text-orange-600 text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{pendingCount}</div>
              <div className="text-gray-600 text-sm font-medium">Pending</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4 border-green-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <FiCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{completedCount}</div>
              <div className="text-gray-600 text-sm font-medium">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FiTrendingUp className="text-gray-600" />
            <h3 className="text-gray-800 font-semibold">Progress Overview</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {completedCount} of {totalCount} tasks completed
              </span>
              <span className="text-green-600 font-bold">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FiTarget className="text-gray-600" />
          <h3 className="text-gray-800 font-semibold">Filter Tasks</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => onFilterChange('all')}
            className={`py-3 px-4 text-sm font-medium rounded-lg border transition-colors duration-200 ${
              filter === 'all' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            All ({totalCount})
          </button>
          <button 
            onClick={() => onFilterChange('pending')}
            className={`py-3 px-4 text-sm font-medium rounded-lg border transition-colors duration-200 ${
              filter === 'pending' 
                ? 'bg-orange-600 text-white border-orange-600' 
                : 'text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button 
            onClick={() => onFilterChange('completed')}
            className={`py-3 px-4 text-sm font-medium rounded-lg border transition-colors duration-200 ${
              filter === 'completed' 
                ? 'bg-green-600 text-white border-green-600' 
                : 'text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Done ({completedCount})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && todos.length === 0 && (
        <div className="card text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your todos...</p>
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 && !isLoading ? (
          <div className="card text-center py-16">
            {filter === 'all' ? (
              <div>
                <FiList className="text-gray-400 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No todos yet</h3>
                <p className="text-gray-600">Create your first todo to get started on your productivity journey!</p>
              </div>
            ) : filter === 'pending' ? (
              <div>
                <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">All caught up! 🎉</h3>
                <p className="text-gray-600">Fantastic work! You've completed all your pending tasks.</p>
              </div>
            ) : (
              <div>
                <FiClock className="text-orange-500 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No completed todos</h3>
                <p className="text-gray-600">Complete some tasks to see your accomplishments here.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo, index) => (
              <div key={todo.id}>
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