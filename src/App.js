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
    <div className="min-h-screen gradient-bg">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse floating"></div>
        <div className="absolute top-32 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse floating" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse floating" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-12 animate-fade-in">
          <div className="glass-card mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-2xl">
                  <FiZap className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                    TodoMaster
                  </h1>
                  <p className="text-white/70 text-lg">Your productivity companion with glassmorphism design</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`glass-light px-4 py-2 rounded-full flex items-center gap-3 transition-all duration-300 ${
                  isConnected 
                    ? 'border-green-400/50 bg-green-500/20' 
                    : 'border-red-400/50 bg-red-500/20 animate-pulse'
                }`}>
                  <FiServer className={`text-sm ${isConnected ? 'text-green-300' : 'text-red-300'}`} />
                  <span className={`text-sm font-medium ${isConnected ? 'text-green-200' : 'text-red-200'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                
                <button 
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="glass-button p-3 bg-blue-500/20 hover:bg-blue-500/30 text-white 
                             hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed 
                             disabled:hover:scale-100 transition-all duration-200 focus-ring"
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
              <div className="mb-6 animate-slide-up">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                  Create Task
                </h2>
                <p className="text-white/60">Add a new todo to your list</p>
              </div>
              <TodoForm 
                onAddTodo={handleAddTodo}
                isLoading={isLoading}
              />
            </div>
          </section>

          {/* Todo List */}
          <section className="xl:col-span-8">
            <div className="mb-6 animate-slide-up">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></div>
                My Tasks
              </h2>
              <p className="text-white/60">Manage your todo list efficiently</p>
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
        <footer className="mt-16 animate-fade-in">
          <div className="glass-card text-center">
            <p className="text-white/70 flex items-center justify-center gap-2 flex-wrap">
              <span>Built with</span>
              <FiHeart className="text-red-400 animate-pulse" />
              <span>using React & Tailwind CSS</span>
              <span className="mx-2">|</span>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white transition-colors duration-200 underline decoration-blue-300/50 hover:decoration-white"
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
