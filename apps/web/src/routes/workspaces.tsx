import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createWorkspaceSchema } from "@trello-clone/schemas";

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

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const serverUrl =
          import.meta.env.VITE_SERVER_URL.replace(/\/+$/, "");

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
        import.meta.env.VITE_SERVER_URL.replace(
          /\/+$/,
          "",
        );

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
      console.error(
        "Creating workspace failed:",
        error,
      );

      setCreateError(
        "Unable to connect to server. Please try again later.",
      );
    } finally {
      setCreating(false);
    }
  };
  const handleDeleteWorkspace = async (workspaceId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workspace?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const serverUrl =
        import.meta.env.VITE_SERVER_URL.replace(
          /\/+$/,
          "",
        );

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
      console.error(
        "Deleting workspace failed:",
        error,
      );

      window.alert(
        "Unable to connect to server. Please try again later.",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800 dark:border-slate-700 dark:border-t-white" />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Loading your workspaces...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl dark:bg-red-900/40">
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

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Workspace Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            My Workspaces
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Create and manage the workspaces you use to organize
            your projects and collaborate with your team.
          </p>
        </div>

        {/* Create Workspace */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xl text-white dark:bg-white dark:text-slate-900">
              +
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Create a workspace
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Start a new space for your projects and team.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreateWorkspace}
            className="mt-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="workspace-name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Workspace name
                </label>

                <input
                  id="workspace-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="e.g. My Project"
                  maxLength={100}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                />

                {validationErrors.name && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.name[0]}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="workspace-description"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Description
                  <span className="ml-1 font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <input
                  id="workspace-description"
                  type="text"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="What is this workspace for?"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                />
              </div>
            </div>

            {createError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                {createError}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {creating
                  ? "Creating..."
                  : "Create Workspace"}
              </button>
            </div>
          </form>
        </section>

        {/* Workspace List */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Your workspaces
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {workspaces.length}{" "}
                {workspaces.length === 1
                  ? "workspace"
                  : "workspaces"}
              </p>
            </div>
          </div>

          {workspaces.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
                📁
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                No workspaces yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Create your first workspace above to start
                organizing your projects.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
                      📁
                    </div>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {workspace.role}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                    {workspace.name}
                  </h3>

                  <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    {workspace.description ||
                      "No description provided."}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <span className="text-xs text-slate-400">
                      Workspace #{workspace.id}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteWorkspace(workspace.id)
                      }
                      className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}