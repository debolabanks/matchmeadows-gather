
import React, { createContext, useEffect, useState } from "react";
import { User, AuthContextType } from "./authTypes";
import { 
  signInWithEmailAndPassword, 
  signUpWithEmailAndPassword
} from "@/services/authService";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("matchmeadows_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("matchmeadows_user");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await signInWithEmailAndPassword(email, password);
      setUser(user);
      localStorage.setItem("matchmeadows_user", JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const user = await signUpWithEmailAndPassword(email, password, name);
      setUser(user);
      localStorage.setItem("matchmeadows_user", JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    // Clear user from state and localStorage
    setUser(null);
    localStorage.removeItem("matchmeadows_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
