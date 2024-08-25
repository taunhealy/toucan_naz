"use client";

import "~/styles/globals.css";
import type { ReactNode } from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "./NavBar";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/auth/session");
      const sessionData = await res.json();
      setSession(sessionData);
    };
    fetchSession();
  }, []);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <body>
            <Navigation />
            {children}
          </body>
        </html>
      </QueryClientProvider>
    </SessionProvider>
  );
}
