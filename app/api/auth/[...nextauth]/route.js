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
    async jwt({ token, account, user }) {
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = account.expires_at;
      }

      // On initial sign in, NextAuth provides `user` containing profile info.
      // Persist name/email/picture into the token so session() can expose them.
      if (user) {
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
        // some providers use `image` and some `picture` — normalize to `picture`
        if (user.image) token.picture = user.image;
        if (user.picture) token.picture = token.picture || user.picture;
      }

      return token;
    },

    // 🔹 Expose access_token to the client
    async session({ session, token }) {
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;
      session.expires_at = token.expires_at;
      // ensure user profile fields are populated from the token
      session.user = session.user || {};
      if (token.name && !session.user.name) session.user.name = token.name;
      if (token.email && !session.user.email) session.user.email = token.email;
      // NextAuth expects `session.user.image` — map `picture` from token if available
      if (token.picture && !session.user.image) session.user.image = token.picture;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
