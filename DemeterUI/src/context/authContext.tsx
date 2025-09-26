import axios from "axios";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  loadingToken: boolean;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  isAuthenticated: false,
  setAccessToken: () => {},
  logout: () => {},
  refreshAccessToken: async () => {},
  loadingToken: true,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState<boolean>(true);
  console.log("accessToken", accessToken);
  const isAuthenticated = accessToken ? true : false;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const tokenRefreshRequest = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  //Auto Refresh Access Token on Page Load
  useEffect(() => {
    console.log("page refreshing");
    const initializeAuth = async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("Failed to initialize authentication", error);
        logout();
      }
    };

    initializeAuth();
  }, []);

  const refreshAccessToken = async () => {
    try {
      const response = await tokenRefreshRequest.post("/Auth/refresh-token");
      const newToken = response.data.accessToken;
      setAccessToken(newToken);
    } catch (error) {
      setAccessToken(null);
    } finally {
      setLoadingToken(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        setAccessToken,
        logout,
        refreshAccessToken,
        loadingToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthProvider;
