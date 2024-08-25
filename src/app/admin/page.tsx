"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    linkedInUrl: "",
    facebookUrl: "",
    instagramUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      const fetchData = async () => {
        try {
          await fetchUserData(session.user.id);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      void fetchData();
    }
  }, [session]);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setFormData({
        linkedInUrl: userData.linkedInUrl || "",
        facebookUrl: userData.facebookUrl || "",
        instagramUrl: userData.instagramUrl || "",
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      if (data.user && data.user.id) {
        router.push(`/profile/${data.user.id}`);
      } else {
        throw new Error("User data not returned from server");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return <div>Please sign in to edit your profile.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="linkedInUrl" className="mb-1 block">
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedInUrl"
            name="linkedInUrl"
            value={formData.linkedInUrl}
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
        </div>
        <div>
          <label htmlFor="facebookUrl" className="mb-1 block">
            Facebook URL
          </label>
          <input
            type="url"
            id="facebookUrl"
            name="facebookUrl"
            value={formData.facebookUrl}
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
        </div>
        <div>
          <label htmlFor="instagramUrl" className="mb-1 block">
            Instagram URL
          </label>
          <input
            type="url"
            id="instagramUrl"
            name="instagramUrl"
            value={formData.instagramUrl}
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}