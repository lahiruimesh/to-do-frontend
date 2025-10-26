import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const todoService = {
  // Get all todos
  getTodos: async (status = '') => {
    try {
      const params = status ? { status } : {};
      const response = await api.get('/todos', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch todos');
    }
  },

  // Get pending todos (last 5)
  getPendingTodos: async () => {
    try {
      const response = await api.get('/todos/pending');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pending todos');
    }
  },

  // Get todo by ID
  getTodoById: async (id) => {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch todo');
    }
  },

  // Create new todo
  createTodo: async (todoData) => {
    try {
      const response = await api.post('/todos', todoData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create todo');
    }
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update todo');
    }
  },

  // Delete todo
  deleteTodo: async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete todo');
    }
  },

  // Toggle todo completion status
  toggleTodo: async (id, completed) => {
    try {
      const response = await api.put(`/todos/${id}`, { completed });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to toggle todo');
    }
  },
};

export default api;