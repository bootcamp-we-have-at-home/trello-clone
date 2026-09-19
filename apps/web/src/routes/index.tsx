import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = useNavigate();

  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
    state: string;
  } | null>(null);
  useEffect(() => {
    const getCurrentUser = async () => {
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

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error(
          "Failed to get current user:",
          error,
        );
      }
    };

    void getCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      const serverUrl =
        import.meta.env.VITE_SERVER_URL.replace(
          /\/+$/,
          "",
        );

      const response = await fetch(
        `${serverUrl}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        console.error("Logout failed");
        return;
      }

      setUser(null);
      navigate({ to: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-12 sm:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-3xl text-white shadow-sm dark:bg-white dark:text-slate-900">
            ✓
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Organize your work.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Trello Clone helps you organize projects,
            manage workspaces, and keep your team focused
            in one simple place.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Go to Dashboard
                </Link>

                <Link
                  to="/workspaces"
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  View Workspaces
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
              📁
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
              Workspaces
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Create separate workspaces to organize
              different projects and teams.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
              📋
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
              Projects
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Keep your projects structured and make
              progress easier to track.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
              👥
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
              Collaboration
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Work with your team and keep everyone aligned
              around the same goals.
            </p>
          </div>
        </section>

        {/* Logged-in User */}
        {user && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Signed in as
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                  {user.username}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                Logout
              </button>
            </div>
          </section>
        )}

        {/* API Status */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                API Status
              </h2>

              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Trello Clone API is running.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}