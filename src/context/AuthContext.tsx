import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { User } from "../services/api";
import { api } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  setAuthData: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiry");
    setToken(null);
    setUser(null);
  }, []);

  const verifyAuthentication = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (!storedToken) {
      return false;
    }

    // Check if token is expired based on stored expiry time
    if (tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry, 10);
      if (Date.now() >= expiryTime) {
        console.log("Token expired based on stored expiry time");
        logout();
        return false;
      }
    }

    // Verify token with backend
    try {
      const result = await api.verifyToken();
      if (!result.valid) {
        console.log("Token validation failed on backend");
        logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
      return false;
    }
  }, [logout]);

  useEffect(() => {
    // Load and verify stored auth data on mount
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          // Verify the token is still valid
          const isValid = await verifyAuthentication();

          if (isValid) {
            setUser(parsedUser);
            setToken(storedToken);
          }
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [verifyAuthentication, logout]);

  // Re-verify authentication when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && token) {
        console.log("Page became visible, verifying authentication...");
        const isValid = await verifyAuthentication();
        if (!isValid) {
          console.log("Authentication invalid, user logged out");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [token, verifyAuthentication]);

  // Listen for 401 unauthorized events from API
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log("Received unauthorized event, logging out...");
      logout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  const setAuthData = (newToken: string, newUser: User) => {
    // Calculate expiry time (30 days from now, matching backend JWT_EXPIRATION)
    const expiryTime = Date.now() + 30 * 24 * 60 * 60 * 1000;

    // Store in localStorage
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("tokenExpiry", expiryTime.toString());

    // Update state
    setToken(newToken);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setAuthData,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
