import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
    state: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/me`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          navigate({ to: "/login" });
          return;
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error("Authentication check failed:", error);

        navigate({ to: "/login" });
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <p className="text-slate-700 dark:text-slate-300">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Welcome, {user.username}!
        </p>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Email: {user.email}
        </p>
      </main>
    </div>
  );
}