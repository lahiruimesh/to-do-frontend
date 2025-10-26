import React, { useState, useEffect, useCallback } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { todoService } from './services/api';
import { FiRefreshCw, FiServer } from 'react-icons/fi';
import './App.css';

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
    <div className="App">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              📝 Todo App
            </h1>
            <div className="header-actions">
              <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                <FiServer className="connection-icon" />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <button 
                onClick={handleRefresh}
                className="refresh-btn"
                disabled={isLoading}
                title="Refresh todos"
              >
                <FiRefreshCw className={isLoading ? 'spinning' : ''} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="app-main">
          {/* Add Todo Form */}
          <section className="form-section">
            <h2 className="section-title">Add New Todo</h2>
            <TodoForm 
              onAddTodo={handleAddTodo}
              isLoading={isLoading}
            />
          </section>

          {/* Todo List */}
          <section className="list-section">
            <h2 className="section-title">My Todos</h2>
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
        <footer className="app-footer">
          <p>
            Built with ❤️ using React & Node.js | 
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
