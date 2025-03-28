
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
