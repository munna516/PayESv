import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        // Check if email and password are provided
        if (!email || !password) {
          return null;
        }
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );
          if (res.status === 401 || res.status === 404) {
            return null;
          }
          const data = await res.json();
          return data;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.profile_picture = user.profile_picture;
        token.provider = user.provider;
      }
      return token;
    },
    // Attach the custom data from the JWT token to the session
    async session({ session, token }) {
      if (token) {
        session.role = token.role;
        session.profile_picture = token.profile_picture;
        session.provider = token.porvider;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
