/**
 * API Service for DriveLog Backend
 */

const API_BASE_URL = "http://localhost/driveapi";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  birthdate: string;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  name: string;
  birthdate: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  }

  async verifyToken(): Promise<{
    valid: boolean;
    user_id?: number;
    username?: string;
  }> {
    const token = localStorage.getItem("token");
    if (!token) {
      return { valid: false };
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/verify`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      return data.success ? { valid: true, ...data.data } : { valid: false };
    } catch (error) {
      return { valid: false };
    }
  }

  async getUser(userId: number): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user");
    }

    return data.data;
  }

  // Log management methods
  async getLogs() {
    const response = await fetch(`${this.baseUrl}/logs`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch logs");
    }

    return data.data;
  }

  async createLog(logData: {
    start_time: string;
    end_time: string;
    description: string;
  }) {
    const response = await fetch(`${this.baseUrl}/logs`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(logData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create log");
    }

    return data.data;
  }

  async updateLog(
    logId: number,
    logData: {
      start_time: string;
      end_time: string;
      description: string;
    }
  ) {
    const response = await fetch(`${this.baseUrl}/logs/${logId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(logData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update log");
    }

    return data.data;
  }

  async deleteLog(logId: number) {
    const response = await fetch(`${this.baseUrl}/logs/${logId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete log");
    }

    return data;
  }
}

export const api = new ApiService(API_BASE_URL);
