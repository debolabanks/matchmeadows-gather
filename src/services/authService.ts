import { User, UserProfile } from "@/contexts/authTypes";
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
    provider: foundUser.provider,
    profile: foundUser.profile,
    verified: foundUser.verified
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
    provider: "email",
    verified: false,
    profile: {
      verificationStatus: "unverified",
      locationPrivacy: "public"
    }
  };
  
  // Add to mock database
  MOCK_USERS.push(newUser);
  
  // Create a user object without the password
  const userWithoutPassword: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    provider: newUser.provider,
    profile: newUser.profile,
    verified: newUser.verified
  };
  
  return userWithoutPassword;
};

export const resetPassword = async (email: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if email exists
  const existingUser = MOCK_USERS.find(u => u.email === email);
  if (!existingUser) {
    throw new Error("Email not found");
  }
  
  // In a real app, this would send an email with a reset link
  // For our mock implementation, we'll just consider it successful
  // The reset code would typically be stored and validated when the user clicks the link
  
  console.log(`Password reset initiated for ${email}`);
};

export const confirmPasswordReset = async (email: string, newPassword: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find user
  const userIndex = MOCK_USERS.findIndex(u => u.email === email);
  if (userIndex === -1) {
    throw new Error("Email not found");
  }
  
  // Update password in our mock database
  MOCK_USERS[userIndex].password = newPassword;
  
  console.log(`Password reset completed for ${email}`);
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find user
  const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  
  // Update profile in our mock database
  MOCK_USERS[userIndex].profile = {
    ...MOCK_USERS[userIndex].profile || {},
    ...profileData
  };
  
  // Create a user object without the password
  const userWithoutPassword: User = {
    id: MOCK_USERS[userIndex].id,
    name: MOCK_USERS[userIndex].name,
    email: MOCK_USERS[userIndex].email,
    provider: MOCK_USERS[userIndex].provider,
    profile: MOCK_USERS[userIndex].profile,
    verified: MOCK_USERS[userIndex].verified
  };
  
  return userWithoutPassword;
};

export const requestVerification = async (userId: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find user
  const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  
  // Update verification status
  if (MOCK_USERS[userIndex].profile) {
    MOCK_USERS[userIndex].profile.verificationStatus = "pending";
  } else {
    MOCK_USERS[userIndex].profile = {
      verificationStatus: "pending"
    };
  }
  
  // In a real app, this would trigger an email or SMS verification process
  
  // Create a user object without the password
  const userWithoutPassword: User = {
    id: MOCK_USERS[userIndex].id,
    name: MOCK_USERS[userIndex].name,
    email: MOCK_USERS[userIndex].email,
    provider: MOCK_USERS[userIndex].provider,
    profile: MOCK_USERS[userIndex].profile,
    verified: MOCK_USERS[userIndex].verified
  };
  
  return userWithoutPassword;
};
