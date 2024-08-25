"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  linkedInUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
}

const ProfilePage = () => {
  const { id } = useParams(); // Destructure id directly
  console.log("ProfilePage id:", id); // Debugging line

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("ProfilePage id:", id);

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData: User = await res.json();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      void fetchUser();
    } else {
      setIsLoading(false);
      setError("User ID is missing");
    }
  }, [id]); // Removed 'params' from the dependency array

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">{user.name}&apos;s Profile</h1>
      <div className="space-y-4">
        {user.linkedInUrl && (
          <p>
            LinkedIn:{" "}
            <a
              href={user.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {user.linkedInUrl}
            </a>
          </p>
        )}
        {user.facebookUrl && (
          <p>
            Facebook:{" "}
            <a
              href={user.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {user.facebookUrl}
            </a>
          </p>
        )}
        {user.instagramUrl && (
          <p>
            Instagram:{" "}
            <a
              href={user.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {user.instagramUrl}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;