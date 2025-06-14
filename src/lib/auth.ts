import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    /**
     I only wanted to allow club and collage emails to sign in, but I am opening it up so students can have a portfolio of the event they have attended. But still only the allowed emails can create events. */

    // async signIn({ user }) {
    //   if (user.email && allowedEmails.includes(user.email)) {
    //     return true;
    //   }
    //   return false;
    // },

    async signIn({ user }) {
      if (user.email?.endsWith("gectcr.ac.in")) {
        return true;
      }
      return false;
    },
    async session({ session, user }) {
      if (session.user) {
        (session.user as { id: string }).id = user.id;
      }
      return session;
    },
  },
};
