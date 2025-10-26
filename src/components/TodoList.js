import React from 'react';
import TodoItem from './TodoItem';
import { FiList, FiAlertCircle } from 'react-icons/fi';

const TodoList = ({ 
  todos, 
  onToggleTodo, 
  onUpdateTodo, 
  onDeleteTodo, 
  isLoading,
  error 
}) => {
  // All todos are already filtered to show only incomplete tasks (max 5)
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
      {/* Simple header */}
      {totalCount > 0 && (
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-3">
            <FiList className="text-blue-600" />
            <h3 className="text-gray-800 font-semibold">Recent Tasks</h3>
            <span className="text-sm text-gray-500">({totalCount} pending)</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && todos.length === 0 && (
        <div className="card text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your todos...</p>
        </div>
      )}

      {/* Todo List */}
      <div className="space-y-3">
        {todos.length === 0 && !isLoading ? (
          <div className="card text-center py-16">
            <div>
              <FiList className="text-gray-400 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No pending tasks</h3>
              <p className="text-gray-600">Create your first task to get started on your productivity journey!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo, index) => (
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