
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (c) => {
        // look up user in Mongo + verify password (bcrypt)
        // return { id, name, email } if ok, else null
        return null;
      }
    })
  ],
  session: { strategy: "jwt" }
});
