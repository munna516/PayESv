import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
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
        session.provider = token.provider;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        // Handle different providers
        if (account.provider === "google") {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/googlelogin`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                profile_picture: user.image,
                provider: account.provider,
              }),
            }
          );

          if (response.ok) {
            const userData = await response.json();
            user.role = userData.role || "user";
            user.provider = account.provider;
            return true;
          }
          return false;
        }

        if (account.provider === "facebook") {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/facebooklogin`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                profile_picture: user.image,
                provider: account.provider,
              }),
            }
          );

          if (response.ok) {
            const userData = await response.json();
            // Add role and other properties to the user object
            user.role = userData.role || "user";
            user.provider = account.provider;
            return true;
          }
          return false;
        }

        // For credentials provider, the user object already contains role from your login API
        if (account.provider === "credentials") {
          return true;
        }

        return false;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false; // Deny sign in if there's an error
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
