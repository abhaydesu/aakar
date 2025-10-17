import NextAuth, { NextAuthOptions, Profile, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const isProd = process.env.NODE_ENV === 'production';
const useSecureCookies = isProd;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: { signIn: '/signin' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET!,
  cookies: {
    sessionToken: {
      name: useSecureCookies ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: useSecureCookies },
    },
  },
  callbacks: {
    async signIn({ profile }: { profile?: Profile }) {
      if (!profile || !profile.email) return false;
      try {
        await dbConnect();
        const dbUser = await User.findOne({ email: profile.email });
        if (!dbUser) {
          await User.create({
            email: profile.email,
            name: profile.name || profile.email.split('@')[0],
            image: profile.image,
          });
        }
        return true;
      } catch (err) {
        console.error('signIn callback error', err);
        return false;
      }
    },

    // jwt callback: ensure token contains role (used by middleware getToken)
    async jwt({ token, user }) {
      try {
        // first time after sign in: user is present
        if (user?.email) {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser && dbUser.role) {
            token.role = dbUser.role;
          }
          token.email = user.email;
        }
        return token;
      } catch (err) {
        console.error('jwt callback error', err);
        return token;
      }
    },

    // session callback: populate session from token
    async session({ session, token }: { session: Session; token: any }) {
      try {
        if (token?.sub) session.user.id = token.sub;
        if (token?.role) session.user.role = token.role;
        if (!session.user.role && token?.email) {
          await dbConnect();
          const sessionUser = await User.findOne({ email: token.email });
          if (sessionUser) session.user.role = sessionUser.role;
        }
      } catch (err) {
        console.error('session callback error', err);
      }
      return session;
    },

    async redirect({ url, baseUrl, user }: { url: string; baseUrl: string; user?: { email?: string } }) {
      try {
        const target = url?.startsWith('/') ? `${baseUrl}${url}` : url;
        if (user?.email) {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser && !dbUser.role) {
            return `${baseUrl}/select-role`;
          }
        }
        if (target) return target;
      } catch (err) {
        console.error('redirect callback error', err);
      }
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
