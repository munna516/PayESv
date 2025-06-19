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
            `${process.env.NEXT_PUBLIC_APP_URL}/api/login`,
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
        token.id = user.id;
        token.role = user.role;
        token.profile_picture = user.profile_picture;
        token.provider = user.provider;
        token.plan = user.plan;
        token.status = user.status;
        token.phone = user.phone;
        token.street_address = user.street_address;
        token.city = user.city;
        token.postal_code = user.postal_code;
        token.country = user.country;
        token.created_at = user.created_at;
      }
      return token;
    },
    // Attach the custom data from the JWT token to the session
    async session({ session, token }) {
      if (token) {
        session.role = token.role;
        session.id = token.id;
        session.profile_picture = token.profile_picture;
        session.provider = token.provider;
        session.plan = token.plan;
        session.status = token.status;
        session.phone = token.phone;
        session.street_address = token.street_address;
        session.city = token.city;
        session.postal_code = token.postal_code;
        session.country = token.country;
        session.created_at = token.created_at;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        // Handle different providers
        if (account.provider === "google") {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/googlelogin`,
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
            user.id = userData.user.id;
            user.role = userData.user.role;
            user.provider = account.provider;
            user.status = userData.user.status;
            user.plan = userData.user.plan;
            user.phone = userData.user.phone;
            user.street_address = userData.user.street_address;
            user.city = userData.user.city;
            user.postal_code = userData.user.postal_code;
            user.country = userData.user.country;
            user.created_at = userData.user.created_at;
            return true;
          }
          return false;
        }

        if (account.provider === "facebook") {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/facebooklogin`,
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
