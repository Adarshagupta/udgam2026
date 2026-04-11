import { compare, hashSync } from "bcryptjs";
import { AdminRole } from "@prisma/client";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getDemoAdminCredentials, getDemoStore } from "@/lib/demo-data";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

let bootstrapPromise: Promise<void> | null = null;

export async function ensureBootstrapAdmin() {
  if (env.demoMode || !prisma) {
    return;
  }

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const existing = await prisma.adminUser.findUnique({
        where: { email: env.admin.email },
      });

      if (existing) {
        return;
      }

      await prisma.adminUser.create({
        data: {
          email: env.admin.email,
          name: env.admin.name,
          passwordHash: hashSync(env.admin.password, 10),
          role: AdminRole.SUPER_ADMIN,
        },
      });
    })().finally(() => {
      bootstrapPromise = null;
    });
  }

  await bootstrapPromise;
}

export const authOptions: NextAuthOptions = {
  secret: env.nextAuthSecret,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin",
  },
  providers: [
    CredentialsProvider({
      name: "Organizer login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        if (env.demoMode || !prisma) {
          const demoUser = getDemoStore().admins.find(
            (admin) => admin.email === credentials.email,
          );

          if (!demoUser) {
            return null;
          }

          const isMatch = await compare(credentials.password, demoUser.passwordHash);
          if (!isMatch) {
            return null;
          }

          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
          };
        }

        await ensureBootstrapAdmin();

        const admin = await prisma.adminUser.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) {
          return null;
        }

        const isMatch = await compare(credentials.password, admin.passwordHash);

        if (!isMatch) {
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role ?? "ORGANIZER";
      }

      return session;
    },
  },
};

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export function getAdminHint() {
  return env.demoMode ? getDemoAdminCredentials() : null;
}

