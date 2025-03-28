
import React, { createContext, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  // Add more user fields as needed
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123" // Obviously not secure, just for demo
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("matchmeadows_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
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
    // This would normally be an API call to your backend
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in our mock database
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error("Invalid credentials");
    }
    
    // Remove password before storing in state/localStorage
    const { password: _, ...userWithoutPassword } = foundUser;
    
    setUser(userWithoutPassword);
    localStorage.setItem("matchmeadows_user", JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  const signUp = async (email: string, password: string, name: string) => {
    // This would normally be an API call to your backend
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      throw new Error("Email already in use");
    }
    
    // Create new user
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      name,
      email,
      password
    };
    
    // Add to mock database
    MOCK_USERS.push(newUser);
    
    // Remove password before storing in state/localStorage
    const { password: _, ...userWithoutPassword } = newUser;
    
    setUser(userWithoutPassword);
    localStorage.setItem("matchmeadows_user", JSON.stringify(userWithoutPassword));
    setIsLoading(false);
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
