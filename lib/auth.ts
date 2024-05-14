import type { NextAuthOptions  } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions  = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize (credentials, req) {
        if (typeof credentials !== "undefined") {
          const res = await fetch(process.env.NEXTAUTH_URL!+'/api/user/login', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body:JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          })

          const user = await res.json();

          if (typeof user !== "undefined") {
            return user
          } else {
            return null
          }
        } else {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({token, user}) {
      return {...token, ...user}
    },

    async session({session, token}) {
      session.user = token as any
      return session
    }
  }
}