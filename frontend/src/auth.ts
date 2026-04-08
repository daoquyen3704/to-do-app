import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { api } from '@/lib/api';

async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await api.post('/auth/jwt/refresh/', { refresh: refreshToken });
    const data = res.data;
    
    return {
      accessToken: data.access,
      refreshToken: data.refresh || refreshToken,
      accessTokenExpiry: Math.floor(Date.now() / 1000) + 15 * 60,
    };
  } catch (error) {
    return { error: 'RefreshAccessTokenError' };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const res = await api.post('/auth/jwt/create/', {
            username: credentials.username,
            password: credentials.password,
          });

          const data = res.data;
          if (!data.access) return null;

          return {
            id: credentials.username as string,
            name: credentials.username as string,
            accessToken: data.access,
            refreshToken: data.refresh,
            accessTokenExpiry: Math.floor(Date.now() / 1000) + 15 * 60,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpiry = user.accessTokenExpiry;
        return token;
      }

      const now = Math.floor(Date.now() / 1000);
      if (now < token.accessTokenExpiry - 60) {
        return token;
      }

      const refreshedTokens = await refreshAccessToken(token.refreshToken);
      if (refreshedTokens.error) {
        return { ...token, error: refreshedTokens.error };
      }

      return {
        ...token,
        ...refreshedTokens,
      };
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
});
