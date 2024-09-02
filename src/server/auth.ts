import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";

import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import { db } from "~/server/db";

import type { User as PUser } from "@prisma/client";
import { z } from "zod";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: PUser;
  }
}

const getUserCred = async (email: string): Promise<PUser | null> => {
  const user = await db.user.findUnique({ where: { email } });
  return user;
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  //
  callbacks: {
    session: ({ session, user }) => {
      if (session.user) {
        session.user = user as PUser;
      }
      return session;
    },
    // async jwt({ session, token, user }) {
    //   console.log("session", session);
    //   console.log("token", token);
    //   console.log("user", user);

    //   return { ...token, };
    // }
  },
  //
  adapter: PrismaAdapter(db) as Adapter,
  // secret: process.env.NEXTAUTH_SECRET,
  // session: {
  //   strategy: 'jwt',
  //   maxAge: 30 * 24 * 60 * 60, // 30 Days
  // },

  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("cred", credentials);
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        console.log("parsed", parsedCredentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const user = await getUserCred(email);

        console.log("user", user);
        password;

        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
