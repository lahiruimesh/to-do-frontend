import React, { useState, useEffect, useCallback } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { todoService } from './services/api';
import { FiRefreshCw, FiServer, FiZap, FiHeart } from 'react-icons/fi';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Load todos from API
  const loadTodos = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setError(null);
      
      const response = await todoService.getTodos();
      setTodos(response.data || []);
      setIsConnected(true);
    } catch (err) {
      console.error('Error loading todos:', err);
      setError(err.message);
      setIsConnected(false);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
    
    // Optional: Set up polling to refresh todos every 30 seconds
    const interval = setInterval(() => {
      loadTodos(false); // Refresh without showing loading spinner
    }, 30000);
    
    return () => clearInterval(interval);
  }, [loadTodos]);

  // Add new todo
  const handleAddTodo = async (todoData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await todoService.createTodo(todoData);
      
      // Add the new todo to the beginning of the list
      setTodos(prevTodos => [response.data, ...prevTodos]);
      
      return response.data;
    } catch (err) {
      console.error('Error creating todo:', err);
      setError(err.message);
      throw err; // Re-throw so form can handle it
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle todo completion
  const handleToggleTodo = async (id, completed) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await todoService.toggleTodo(id, completed);
      
      // Update the todo in the list
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? response.data : todo
        )
      );
    } catch (err) {
      console.error('Error toggling todo:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update todo
  const handleUpdateTodo = async (id, todoData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await todoService.updateTodo(id, todoData);
      
      // Update the todo in the list
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? response.data : todo
        )
      );
      
      return response.data;
    } catch (err) {
      console.error('Error updating todo:', err);
      setError(err.message);
      throw err; // Re-throw so component can handle it
    } finally {
      setIsLoading(false);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await todoService.deleteTodo(id);
      
      // Remove the todo from the list
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh todos manually
  const handleRefresh = () => {
    loadTodos(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-12">
          <div className="card p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <FiZap className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
                    TodoMaster
                  </h1>
                  <p className="text-gray-600 text-lg">Your productivity companion</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-full flex items-center gap-3 border transition-all duration-300 ${
                  isConnected 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}>
                  <FiServer className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                
                <button 
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                             disabled:opacity-50 disabled:cursor-not-allowed 
                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Refresh todos"
                >
                  <FiRefreshCw className={`text-lg ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Add Todo Form */}
          <section className="xl:col-span-4">
            <div className="sticky top-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                  Create Task
                </h2>
                <p className="text-gray-600">Add a new todo to your list</p>
              </div>
              <TodoForm 
                onAddTodo={handleAddTodo}
                isLoading={isLoading}
              />
            </div>
          </section>

          {/* Todo List */}
          <section className="xl:col-span-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                My Tasks
              </h2>
              <p className="text-gray-600">Manage your todo list efficiently</p>
            </div>
            <TodoList
              todos={todos}
              onToggleTodo={handleToggleTodo}
              onUpdateTodo={handleUpdateTodo}
              onDeleteTodo={handleDeleteTodo}
              filter={filter}
              onFilterChange={setFilter}
              isLoading={isLoading}
              error={error}
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16">
          <div className="card text-center p-6">
            <p className="text-gray-600 flex items-center justify-center gap-2 flex-wrap">
              <span>Built with</span>
              <FiHeart className="text-red-500" />
              <span>using React & Tailwind CSS</span>
              <span className="mx-2">|</span>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 underline"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
