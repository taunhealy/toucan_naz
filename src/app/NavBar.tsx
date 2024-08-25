import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Navigation() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
  }, [session, status]);

  console.log("Rendering Navigation component");
  console.log("Current session:", session);
  console.log("Current status:", status);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-lg font-bold text-white">MyApp</div>
        <div className="space-x-4">
          {status === "loading" ? (
            <p className="text-white">Loading...</p>
          ) : session ? (
            <>
              <Link
                href={`/profile/${session.user.id}`}
                className="text-white hover:underline"
              >
                Profile
              </Link>
              <Link href="/admin" className="text-white hover:underline">
                Admin Panel
              </Link>
              <button
                onClick={() => signOut()}
                className="text-white hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="text-white hover:underline"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}