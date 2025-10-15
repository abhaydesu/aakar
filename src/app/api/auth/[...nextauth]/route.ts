import NextAuth, { NextAuthOptions, Profile, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }: { session: Session }): Promise<Session> {
      await dbConnect();
      const sessionUser = await User.findOne({ email: session.user?.email });
      
      if (session.user && sessionUser) {
        session.user.id = sessionUser._id.toString();
      }
      
      return session;
    },
    async signIn({ profile }: { profile?: Profile }): Promise<boolean> {
      if (!profile) {
        return false;
      }
      
      try {
        await dbConnect();

        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          await User.create({
            email: profile.email,
            name: profile.name,
            image: profile.image,
          });
        }

        return true;
      } catch (error) {
        if (error instanceof Error) {
            console.log("Error checking if user exists: ", error.message);
        }
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };