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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const serverUrl =
          import.meta.env.VITE_SERVER_URL.replace(
            /\/+$/,
            "",
          );
        const response = await fetch(
          `${serverUrl}/api/auth/me`,
          {
            credentials: "include",
          },
        );

        if (response.status === 401) {
          navigate({ to: "/login" });
          return;
        }
        if (!response.ok) {
          setError(
            "Unable to verify authentication. Please try again later.",
          );
          return;
        }
        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error,
        );

        setError(
          "Unable to connect to server. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    void checkAuthentication();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800 dark:border-slate-700 dark:border-t-white" />

          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl text-red-700 dark:bg-red-900/40 dark:text-red-300">
            !
          </div>

          <h2 className="mt-4 text-lg font-semibold text-red-900 dark:text-red-300">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Welcome back, {user.username}! 👋
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Manage your workspaces and keep your projects
            organized from one place.
          </p>
        </section>

        {/* Quick Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Account
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg dark:bg-slate-800">
                👤
              </div>
            </div>

            <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              {user.username}
            </p>

            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Account Status
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg dark:bg-slate-800">
                ✓
              </div>
            </div>

            <p className="mt-4 text-lg font-semibold capitalize text-slate-900 dark:text-white">
              {user.state}
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your account is currently {user.state}.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                User ID
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg dark:bg-slate-800">
                #
              </div>
            </div>

            <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              #{user.id}
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your account identifier.
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quickly access the main areas of your workspace.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/workspaces" })}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
                  📁
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Manage Workspaces
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Create and manage your workspaces.
                  </p>
                </div>
              </div>

              <div className="mt-5 text-sm font-medium text-slate-700 dark:text-slate-300">
                View Workspaces →
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
                  🏠
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Go Home
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Return to the main page.
                  </p>
                </div>
              </div>

              <div className="mt-5 text-sm font-medium text-slate-700 dark:text-slate-300">
                Go Home →
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}