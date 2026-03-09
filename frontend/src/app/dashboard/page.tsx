"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";

type UserProfile = {
  id: number;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        setError("Failed to load user profile. Please login again.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  if (loading) {
    return <p>Loading user...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!user) {
    return <p>No user found.</p>;
  }

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await logoutUser();
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Logout failed. Please try again.");
      setLogoutLoading(false);
    }
  };

  return (
    <div className="auth-shell" style={{ marginTop: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Welcome {user.email}</p>
      <p>Session refresh is handled in the background while your cookies are valid.</p>
      <button onClick={handleLogout} disabled={logoutLoading}>
        {logoutLoading ? "Signing out..." : "Logout"}
      </button>
    </div>
  );
}