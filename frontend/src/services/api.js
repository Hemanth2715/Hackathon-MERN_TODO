import axios from "axios";
import toast from "react-hot-toast";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle different error status codes
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          toast.error("Session expired. Please login again.");
          break;
        case 403:
          toast.error("You do not have permission to perform this action.");
          break;
        case 404:
          toast.error("Resource not found.");
          break;
        case 429:
          toast.error("Too many requests. Please try again later.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(data?.message || "An error occurred.");
      }
    } else if (error.request) {
      // Network error
      toast.error("Network error. Please check your connection.");
    } else {
      // Request setup error
      toast.error("Request failed. Please try again.");
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put("/auth/profile", userData);
    return response.data;
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.get("/auth/verify");
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Google OAuth URL
  getGoogleAuthURL: () => {
    return `${
      import.meta.env.VITE_API_URL || "http://localhost:3000/api"
    }/auth/google`;
  },
};

// Tasks API
export const tasksAPI = {
  // Get all tasks with filtering and pagination
  getTasks: async (params = {}) => {
    const response = await api.get("/tasks", { params });
    return response.data;
  },

  // Get single task by ID
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Share task with user
  shareTask: async (id, shareData) => {
    const response = await api.post(`/tasks/${id}/share`, shareData);
    return response.data;
  },

  // Unshare task
  unshareTask: async (id, userId) => {
    const response = await api.delete(`/tasks/${id}/unshare`, {
      data: { userId },
    });
    return response.data;
  },

  // Get task statistics
  getTaskStats: async () => {
    const response = await api.get("/tasks/stats");
    return response.data;
  },
};

// Utility functions for API
export const apiUtils = {
  // Set authentication token
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
  },

  // Get authentication token
  getAuthToken: () => {
    return localStorage.getItem("token");
  },

  // Clear authentication
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Get stored user data
  getStoredUser: () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },

  // Store user data
  storeUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Handle API error
  handleError: (error) => {
    console.error("API Error:", error);

    if (error.response?.data?.errors) {
      // Handle validation errors
      error.response.data.errors.forEach((err) => {
        toast.error(`${err.field}: ${err.message}`);
      });
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("An unexpected error occurred");
    }
  },

  // Format error message for display
  formatErrorMessage: (error) => {
    if (error.response?.data?.errors) {
      return error.response.data.errors
        .map((err) => `${err.field}: ${err.message}`)
        .join(", ");
    } else if (error.response?.data?.message) {
      return error.response.data.message;
    } else {
      return "An unexpected error occurred";
    }
  },
};

// Export the configured axios instance for direct use if needed
export default api;
