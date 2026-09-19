import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/workspaces")({
  component: WorkspacesPage,
});

type Workspace = {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  created_at: string;
  updated_at: string;
  role: "admin" | "member";
};

function WorkspacesPage() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState<Workspace[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const serverUrl =
          import.meta.env.VITE_SERVER_URL.replace(
            /\/+$/,
            "",
          );

        const response = await fetch(
          `${serverUrl}/api/workspaces`,
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
            "Unable to fetch workspaces. Please try again later.",
          );
          return;
        }

        const data = await response.json();

        setWorkspaces(data.workspaces);
      } catch (error) {
        console.error(
          "Fetching workspaces failed:",
          error,
        );

        setError(
          "Unable to connect to server. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchWorkspaces();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <p className="text-slate-700 dark:text-slate-300">
          Loading workspaces...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Workspaces
        </h1>

        {workspaces.length === 0 ? (
          <p className="mt-6 text-slate-600 dark:text-slate-300">
            You don't have any workspaces yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {workspace.name}
                </h2>

                {workspace.description && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {workspace.description}
                  </p>
                )}

                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                  Role: {workspace.role}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}