import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                if (!apiBaseUrl) {
                    return null;
                }
                // Call backend login endpoint
                const res = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                    }),
                });
                const user = await res.json();
                if (res.ok && user) {
                    // Return user object; NextAuth will create a JWT with this data
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        accessToken: user.access_token, // store token
                    };
                }
                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.accessToken = user.accessToken;
                token.accessTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour expiry
            }
            
            // If token hasn't expired, return it
            if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }
            
            // Token expired, try to refresh it
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                if (!apiBaseUrl) {
                    throw new Error("API base URL not configured");
                }
                
                const res = await fetch(`${apiBaseUrl}/api/v1/auth/refresh`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken: token.refreshToken }),
                });
                
                const data = await res.json();
                if (res.ok && data.access_token) {
                    return {
                        ...token,
                        accessToken: data.access_token,
                        accessTokenExpires: Date.now() + 60 * 60 * 1000,
                        refreshToken: data.refresh_token || token.refreshToken,
                    };
                }
            } catch (error) {
                console.error("Token refresh failed:", error);
            }
            
            // Refresh failed, invalidate token
            token.accessToken = undefined;
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.accessToken = token.accessToken as string;
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };