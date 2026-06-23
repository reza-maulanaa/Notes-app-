import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;

        console.log("1. Mencari user dengan email:", email);

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .then((res) => res[0]);

        console.log("2. User ditemukan:", user);

        if (!user) {
          console.log("3. User tidak ditemukan, return null");
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("4. Password cocok?", passwordMatch);

        if (!passwordMatch) return null;

        return { id: String(user.id), email: user.email };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email!))
          .then((res) => res[0]);

        if (!existingUser) {
          await db.insert(users).values({
            email: user.email!,
            password: "",
          });
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "github") {
        //cari database ID berdasarkan email
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.email, token.email!))
          .then((res) => res[0]);

        if (dbUser) token.id = String(dbUser.id);
      } else if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
