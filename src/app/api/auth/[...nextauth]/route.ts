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
        const existing = await User.findOne({ email: profile.email });
        if (!existing) {
          await User.create({
            email: profile.email,
            name: profile.name || profile.email.split('@')[0],
            image: profile.image,
          });
        }
        return true;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('signIn callback error', e);
        return false;
      }
    },
    async session({ session }: { session: Session }) {
      try {
        await dbConnect();
        const dbUser = await User.findOne({ email: session.user?.email });
        if (session.user && dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.role = dbUser.role;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('session callback error', e);
      }
      return session;
    },
    async redirect({ url, baseUrl, user }: { url: string; baseUrl: string; user?: any }) {
      try {
        if (user?.email) {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser && !dbUser.role) return `${baseUrl}/select-role`;
        }
        if (!url) return baseUrl;
        // if URL is relative, normalize
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        return url;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('redirect callback error', e);
        return baseUrl;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
