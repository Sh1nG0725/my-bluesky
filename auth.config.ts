import type { DefaultSession, NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.image_url = user.image_url;
        token.app_password = user.app_password;
        token.displayName = user.displayName;
        token.handle = user.handle;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.image_url = token.image_url as string;
        session.user.app_password = token.app_password as string;
        session.user.displayName = token.displayName as string;
        session.user.handle = token.handle as string;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      image_url: string;
      app_password: string;
      displayName: string;
      handle: string;
    } & DefaultSession["user"];
  }
 }
 declare module "next-auth" {
  interface JWT {
    id: string;
    image_url: string;
    app_password: string;
    displayName: string;
    handle: string;
  }
 }
 declare module "next-auth" {
  interface User {
    image_url: string;
    app_password: string;
    displayName: string;
    handle: string;
  }
 }