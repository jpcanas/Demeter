import { useAuth } from "@/context/authContext";
import axios from "axios";
import { useNavigate } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const navigate = useNavigate();

const useAxiosAuthorized = () => {
  const { accessToken, refreshAccessToken, logout } = useAuth();

  axiosInstance.interceptors.request.use(
    function (config) {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`; // adding token on every request[header]
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    function (response) {
      return response; //return normal response if no error
    },
    async function (error) {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await refreshAccessToken();
          return axiosInstance(originalRequest); //retry response with new token
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
          logout();
          navigate("authenticate/login");
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxiosAuthorized;
