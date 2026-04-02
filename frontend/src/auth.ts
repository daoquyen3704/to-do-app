import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await fetch(`${BASE_URL}/auth/jwt/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) throw new Error('Failed to refresh token');
    const data = await res.json();
    
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
          const res = await fetch(`${BASE_URL}/auth/jwt/create/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data = await res.json();
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
