import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { connectToDatabase } from "./mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        await connectToDatabase();
        const admin = await Admin.findOne({ email });
        if (!admin) {
          return null;
        }

        if (!admin.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, admin.password);
        if (!passwordsMatch) {
          return null;
        }

        return {
          id: admin._id.toString(),
          name: admin.username,
          email: admin.email,
          role: admin.role,
          username: admin.username,
        };
      },
    }),
  ],
});
