import { io } from "socket.io-client";
import toast from "react-hot-toast";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  // Connect to socket server
  connect(userId) {
    if (this.socket?.connected) {
      return;
    }

    const socketURL =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

    this.socket = io(socketURL, {
      transports: ["websocket", "polling"],
      timeout: 5000,
      forceNew: true,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
      this.isConnected = true;

      // Join user-specific room for targeted updates
      if (userId) {
        this.socket.emit("join-user-room", userId);
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.isConnected = false;

      // Attempt to reconnect if disconnection was unexpected
      if (reason === "io server disconnect") {
        this.socket.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.isConnected = false;
    });

    // Set up task event listeners
    this.setupTaskListeners();

    return this.socket;
  }

  // Disconnect from socket server
  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Set up task-related event listeners
  setupTaskListeners() {
    if (!this.socket) return;

    // Task created event
    this.socket.on("taskCreated", (data) => {
      console.log("Task created:", data);
      toast.success(`New task created: ${data.task.title}`);
      this.emitToListeners("taskCreated", data);
    });

    // Task updated event
    this.socket.on("taskUpdated", (data) => {
      console.log("Task updated:", data);
      toast.success(`Task updated: ${data.task.title}`);
      this.emitToListeners("taskUpdated", data);
    });

    // Task deleted event
    this.socket.on("taskDeleted", (data) => {
      console.log("Task deleted:", data);
      toast.success("Task deleted successfully");
      this.emitToListeners("taskDeleted", data);
    });

    // Task shared event
    this.socket.on("taskShared", (data) => {
      console.log("Task shared:", data);
      toast.success(`Task "${data.task.title}" was shared with you`);
      this.emitToListeners("taskShared", data);
    });

    // Task unshared event
    this.socket.on("taskUnshared", (data) => {
      console.log("Task unshared:", data);
      toast.info("A shared task was removed from your list");
      this.emitToListeners("taskUnshared", data);
    });

    // Generic task update event
    this.socket.on("task-updated", (data) => {
      this.emitToListeners("task-updated", data);
    });
  }

  // Add event listener
  addEventListener(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);

    // Return a function to remove the listener
    return () => {
      this.removeEventListener(eventName, callback);
    };
  }

  // Remove event listener
  removeEventListener(eventName, callback) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).delete(callback);

      // Clean up empty listener sets
      if (this.listeners.get(eventName).size === 0) {
        this.listeners.delete(eventName);
      }
    }
  }

  // Emit event to all registered listeners
  emitToListeners(eventName, data) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in socket listener for ${eventName}:`, error);
        }
      });
    }
  }

  // Send task update to server
  emitTaskUpdate(data) {
    if (this.socket?.connected) {
      this.socket.emit("task-update", data);
    }
  }

  // Join a specific room
  joinRoom(roomName) {
    if (this.socket?.connected) {
      this.socket.emit("join-room", roomName);
    }
  }

  // Leave a specific room
  leaveRoom(roomName) {
    if (this.socket?.connected) {
      this.socket.emit("leave-room", roomName);
    }
  }

  // Get connection status
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  // Get socket ID
  getSocketId() {
    return this.socket?.id;
  }

  // Manually reconnect
  reconnect() {
    if (this.socket) {
      this.socket.connect();
    }
  }
}

// Create and export a singleton instance
const socketService = new SocketService();

export default socketService;

// React hook for using socket in components
export const useSocket = () => {
  return socketService;
};
