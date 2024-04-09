import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import { loginTop } from '@/app/lib/api';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // 認証
          const agent = await loginTop(email, password);
          const { data } = await agent.getProfile({ actor: agent.session?.did || "" });
          // ユーザ情報作成
          const user = {
            id: data.did,
            name: "",
            email: email,
            app_password: password,
            image_url: data.avatar,
            displayName: data.displayName,
            handle: "@" + data.handle,
          } as User;
          return user;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
