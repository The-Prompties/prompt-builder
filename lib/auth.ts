import bcrypt from 'bcrypt';
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import { compare } from "bcrypt";

declare module "next-auth" {
  interface User {
    id: number;
    login: string;
    email: string;
  }
  
  interface Session {
    user: {
      id: number;
      login: string;
      email?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    login: string;
  }
}

const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export const authOptions: NextAuthOptions = {
  debug: true, 
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            login: credentials.login
          }
        });

        if (!user) {
          console.log('User not found');
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          console.log('Invalid password');
          return null;
        }

        const userForToken = {
          id: user.id,
          login: user.login,
          email: user.login
        };

        console.log('Authorized user:', userForToken);
        return userForToken;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback:', { token, user });
      if (user) {
        token.id = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
        token.login = user.login;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback:', { session, token });
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          login: token.login
        };
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/signin",
  },
};