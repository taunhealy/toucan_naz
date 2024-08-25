"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    console.log("Signing out...");
    signOut();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {!session ? (
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      ) : (
        <>
          <p>Welcome, {session.user.name}</p>
          <button onClick={handleSignOut}>Sign out</button>
        </>
      )}
    </main>
  );
}
