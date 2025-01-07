import axios, { AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN_KEY} from "@/constants/Constants";

const axiosInstance = axios.create({
  baseURL: "http://192.168.0.104:8080",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await axiosInstance({
    ...config,
    ...options,
  });
  return data;
};
