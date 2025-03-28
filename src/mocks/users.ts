
// Mock user data for demo purposes
export type MockUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  provider: "email" | "google" | "facebook";
};

export const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123", // Obviously not secure, just for demo
    provider: "email"
  }
];
