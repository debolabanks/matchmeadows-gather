import React, { createContext, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  // Add more user fields as needed
  provider?: "email" | "google" | "facebook";
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signInWithFacebook: async () => {},
  signOut: async () => {},
});

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123", // Obviously not secure, just for demo
    provider: "email"
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

  const signInWithGoogle = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock Google user (in a real app, this would use Google's authentication API)
    const mockGoogleUser = {
      id: "google-" + Math.random().toString(36).substring(2, 9),
      name: "Google User",
      email: "google-user@example.com",
      provider: "google" as const
    };
    
    // Check if this Google user already exists (by email in this demo)
    const existingUser = MOCK_USERS.find(u => u.email === mockGoogleUser.email);
    
    if (existingUser) {
      // User exists, log them in
      const { password: _, ...userWithoutPassword } = existingUser;
      setUser(userWithoutPassword);
      localStorage.setItem("matchmeadows_user", JSON.stringify(userWithoutPassword));
    } else {
      // New user, add them to our mock database
      MOCK_USERS.push(mockGoogleUser);
      setUser(mockGoogleUser);
      localStorage.setItem("matchmeadows_user", JSON.stringify(mockGoogleUser));
    }
    
    setIsLoading(false);
  };

  const signInWithFacebook = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock Facebook user (in a real app, this would use Facebook's authentication API)
    const mockFacebookUser = {
      id: "fb-" + Math.random().toString(36).substring(2, 9),
      name: "Facebook User",
      email: "facebook-user@example.com",
      provider: "facebook" as const
    };
    
    // Check if this Facebook user already exists (by email in this demo)
    const existingUser = MOCK_USERS.find(u => u.email === mockFacebookUser.email);
    
    if (existingUser) {
      // User exists, log them in
      const { password: _, ...userWithoutPassword } = existingUser;
      setUser(userWithoutPassword);
      localStorage.setItem("matchmeadows_user", JSON.stringify(userWithoutPassword));
    } else {
      // New user, add them to our mock database
      MOCK_USERS.push(mockFacebookUser);
      setUser(mockFacebookUser);
      localStorage.setItem("matchmeadows_user", JSON.stringify(mockFacebookUser));
    }
    
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
        signInWithGoogle,
        signInWithFacebook,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
