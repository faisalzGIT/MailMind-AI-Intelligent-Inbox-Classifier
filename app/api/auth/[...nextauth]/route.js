import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly",
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // 🔹 Store access_token & refresh_token from Google
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = account.expires_at;
      }
      return token;
    },

    // 🔹 Expose access_token to the client
    async session({ session, token }) {
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;
      session.expires_at = token.expires_at;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
