import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createWorkspaceSchema } from "@trello-clone/schemas";
import { requireAuth } from "@/lib/auth";
type Workspace = {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  created_at: string;
  updated_at: string;
  role: "admin" | "member";
};
export const Route = createFileRoute("/workspaces")({
  beforeLoad: requireAuth,
  component: WorkspacesPage,
});

function WorkspacesPage() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(
    null,
  );

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serverUrl =
          import.meta.env.VITE_SERVER_URL.replace(/\/+$/, "");

        const [userResponse, workspaceResponse] =
          await Promise.all([
            fetch(`${serverUrl}/api/auth/me`, {
              credentials: "include",
            }),
            fetch(`${serverUrl}/api/workspaces`, {
              credentials: "include",
            }),
          ]);

        if (
          userResponse.status === 401 ||
          workspaceResponse.status === 401
        ) {
          navigate({ to: "/login" });
          return;
        }

        if (!userResponse.ok) {
          setError(
            "Unable to fetch current user. Please try again later.",
          );
          return;
        }

        if (!workspaceResponse.ok) {
          setError(
            "Unable to fetch workspaces. Please try again later.",
          );
          return;
        }

        const userData = await userResponse.json();
        const workspaceData = await workspaceResponse.json();

        setCurrentUserId(userData.user.id);
        setWorkspaces(workspaceData.workspaces);
      } catch (error) {
        console.error("Fetching workspace data failed:", error);

        setError(
          "Unable to connect to server. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [navigate]);

  const handleCreateWorkspace = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setCreateError(null);
    setValidationErrors({});

    const validationResult = createWorkspaceSchema.safeParse({
      name: name.trim(),
      description: description.trim() || undefined,
    });

    if (!validationResult.success) {
      setCreateError(
        validationResult.error.issues[0]?.message ??
          "Invalid workspace data.",
      );
      return;
    }

    try {
      setCreating(true);

      const serverUrl =
        import.meta.env.VITE_SERVER_URL.replace(/\/+$/, "");

      const response = await fetch(
        `${serverUrl}/api/workspaces`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(validationResult.data),
        },
      );

      const data = await response.json();

      if (response.status === 401) {
        navigate({ to: "/login" });
        return;
      }

      if (!response.ok) {
        setCreateError(
          data.message || "Failed to create workspace.",
        );

        if (data.errors) {
          setValidationErrors(data.errors);
        }

        return;
      }

      setName("");
      setDescription("");

      setWorkspaces((currentWorkspaces) => [
        {
          ...data.workspace,
          role: "admin",
        },
        ...currentWorkspaces,
      ]);
    } catch (error) {
      console.error("Creating workspace failed:", error);

      setCreateError(
        "Unable to connect to server. Please try again later.",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWorkspace = async (
    workspaceId: number,
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workspace?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const serverUrl =
        import.meta.env.VITE_SERVER_URL.replace(/\/+$/, "");

      const response = await fetch(
        `${serverUrl}/api/workspaces/${workspaceId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.status === 401) {
        navigate({ to: "/login" });
        return;
      }

      if (!response.ok) {
        window.alert(
          data.message || "Failed to delete workspace.",
        );
        return;
      }

      setWorkspaces((currentWorkspaces) =>
        currentWorkspaces.filter(
          (workspace) => workspace.id !== workspaceId,
        ),
      );
    } catch (error) {
      console.error("Deleting workspace failed:", error);

      window.alert(
        "Unable to connect to server. Please try again later.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workspaces
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Create and manage your workspaces.
          </p>
        </div>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Create Workspace
          </h2>

          <form
            onSubmit={handleCreateWorkspace}
            className="mt-5 space-y-4"
          >
            <div>
              <label
                htmlFor="workspace-name"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Name
              </label>

              <input
                id="workspace-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="My Workspace"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />

              {validationErrors.name?.map((message) => (
                <p
                  key={message}
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                  {message}
                </p>
              ))}
            </div>

            <div>
              <label
                htmlFor="workspace-description"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Description
              </label>

              <textarea
                id="workspace-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Workspace description"
                rows={3}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />

              {validationErrors.description?.map((message) => (
                <p
                  key={message}
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                  {message}
                </p>
              ))}
            </div>

            {createError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {createError}
              </p>
            )}

            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {creating ? "Creating..." : "Create Workspace"}
            </button>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Your Workspaces
            </h2>

            <span className="text-sm text-slate-500 dark:text-slate-400">
              {workspaces.length} workspace
              {workspaces.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              Loading workspaces...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && workspaces.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <p className="text-slate-600 dark:text-slate-400">
                You do not have any workspaces yet.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            workspaces.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {workspaces.map((workspace, index) => (
                  <article
                    key={workspace.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {workspace.name}
                        </h3>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {workspace.role}
                        </span>
                      </div>

                      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {workspace.description ||
                          "No description provided."}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                      <span className="text-xs text-slate-400">
                        Workspace #{index + 1}
                      </span>

                      {workspace.owner_id === currentUserId && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteWorkspace(
                              workspace.id,
                            )
                          }
                          className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}