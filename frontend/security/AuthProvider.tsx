import React, {createContext, FC, ReactNode, useContext, useEffect, useState,} from "react";
import {authenticate, AuthenticationRequest, getUser, User} from "@/api";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import {AUTH_TOKEN_KEY, AUTH_USER_KEY} from "@/constants/Constants";

interface AuthContextType {
  token?: string;
  user?: User;
  login: (data: AuthenticationRequest) => Promise<boolean>;
  logout: () => void;
  loggedIn: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useState<string | undefined>();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY) || undefined;
        const storedUser = await AsyncStorage.getItem(AUTH_USER_KEY) || undefined;
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          await logout();
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
        await logout();
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

        setLoggedIn(true);
        return true;
      } else {
        await logout();
      }
    } catch (error) {
      await logout();
      return false;
    }

    return false;
  };

  const logout = async () => {
    setLoggedIn(false);
    setUser(undefined);
    setToken("");
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
    router.navigate("/");
  };

  const refreshUser = async () => {
    const response = await getUser({id: user?.id ?? 0});
    if (response) {
      setUser(response);
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(response));
    }
  }

  return (
    <AuthContext.Provider
      value={{token, user, login, logout, loggedIn, refreshUser}}
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
