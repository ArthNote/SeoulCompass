export type UserType = {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  clerkId: string;
  imageUrl: string;
  createdAt: string;
};
