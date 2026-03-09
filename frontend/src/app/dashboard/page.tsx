"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/auth.service";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadUser();
  }, []);

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {user.email}</p>
    </div>
  );
}