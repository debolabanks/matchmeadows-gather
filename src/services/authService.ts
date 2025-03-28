
import { User } from "@/contexts/authTypes";
import { MOCK_USERS, MockUser } from "@/mocks/users";

export const signInWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find user in our mock database
  const foundUser = MOCK_USERS.find(
    u => u.email === email && u.password === password
  );
  
  if (!foundUser) {
    throw new Error("Invalid credentials");
  }
  
  // Create a user object without the password
  const userWithoutPassword: User = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
    provider: foundUser.provider
  };
  
  return userWithoutPassword;
};

export const signUpWithEmailAndPassword = async (
  email: string, 
  password: string, 
  name: string
): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if email already exists
  const existingUser = MOCK_USERS.find(u => u.email === email);
  if (existingUser) {
    throw new Error("Email already in use");
  }
  
  // Create new user
  const newUser: MockUser = {
    id: `${MOCK_USERS.length + 1}`,
    name,
    email,
    password,
    provider: "email"
  };
  
  // Add to mock database
  MOCK_USERS.push(newUser);
  
  // Create a user object without the password
  const userWithoutPassword: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    provider: newUser.provider
  };
  
  return userWithoutPassword;
};

export const signInWithGoogle = async (): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a mock Google user (in a real app, this would use Google's authentication API)
  const mockGoogleUser: User = {
    id: "google-" + Math.random().toString(36).substring(2, 9),
    name: "Google User",
    email: "google-user@example.com",
    provider: "google"
  };
  
  // Check if this Google user already exists (by email in this demo)
  const existingUser = MOCK_USERS.find(u => u.email === mockGoogleUser.email);
  
  if (existingUser) {
    // User exists, return existing user data
    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      provider: existingUser.provider
    };
  }
  
  // New user, add them to our mock database without password
  const newUserForMockDb: MockUser = {
    ...mockGoogleUser,
    provider: "google"
  };
  
  MOCK_USERS.push(newUserForMockDb);
  
  return mockGoogleUser;
};

export const signInWithFacebook = async (): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a mock Facebook user (in a real app, this would use Facebook's authentication API)
  const mockFacebookUser: User = {
    id: "fb-" + Math.random().toString(36).substring(2, 9),
    name: "Facebook User",
    email: "facebook-user@example.com",
    provider: "facebook"
  };
  
  // Check if this Facebook user already exists (by email in this demo)
  const existingUser = MOCK_USERS.find(u => u.email === mockFacebookUser.email);
  
  if (existingUser) {
    // User exists, return existing user data
    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      provider: existingUser.provider
    };
  }
  
  // New user, add them to our mock database without password
  const newUserForMockDb: MockUser = {
    ...mockFacebookUser,
    provider: "facebook"
  };
  
  MOCK_USERS.push(newUserForMockDb);
  
  return mockFacebookUser;
};
