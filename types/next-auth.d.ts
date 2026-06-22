import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "super_admin" | "manager" | "employee";
      username: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: "super_admin" | "manager" | "employee";
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "super_admin" | "manager" | "employee";
    username?: string;
  }
}
