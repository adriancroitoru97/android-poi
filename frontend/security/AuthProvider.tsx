import {createContext, FC, ReactNode, useContext, useEffect, useState,} from "react";
import {authenticate, AuthenticationRequest, User} from "@/api";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import {AUTH_TOKEN_KEY, AUTH_USER_KEY} from "@/constants/Constants";

interface AuthContextType {
  token?: string;
  user?: User;
  login: (data: AuthenticationRequest) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useState<string | undefined>();

  const router = useRouter();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY) || undefined;
        const storedUser = await AsyncStorage.getItem(AUTH_USER_KEY) || undefined;
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
      }
    };

    loadAuthData();
  }, []);

  const login = async (data: AuthenticationRequest) => {
    try {
      const response = await authenticate({email: data.email, password: data.password});
      if (response && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);

        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
        await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));

        return true;
      }
    } catch (error) {
      return false;
    }

    return false;
  };

  const logout = async () => {
    setUser(undefined);
    setToken("");
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
    router.navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{token, user, login, logout}}
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
