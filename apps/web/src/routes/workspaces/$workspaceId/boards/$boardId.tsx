import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import { useEffect, useState } from "react";

import type {
  FormEvent,
  ReactElement,
} from "react";

import { updateBoardSchema } from "@trello-clone/schemas";

import type { UpdateBoardInput } from "@trello-clone/schemas";

type Board = {
  id: number;
  workspace_id: number;
  title: string;
  description: string | null;
  state: string;
  created_at: string;
  updated_at: string;
};

type BoardResponse = {
  board: Board;
};

type ErrorResponse = {
  error?: string;
  message?: string;
};

export const Route = createFileRoute(
  "/workspaces/$workspaceId/boards/$boardId",
)({
  component: BoardDetailsPage,
});

function BoardDetailsPage(): ReactElement | null {
  const navigate = useNavigate();

  const { workspaceId, boardId } =
    Route.useParams();

  const [board, setBoard] =
    useState<Board | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [isEditing, setIsEditing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [canShowBoard, setCanShowBoard] =
    useState<boolean | null>(null);

  const [formData, setFormData] =
    useState<UpdateBoardInput>({
      title: "",
      description: "",
    });

    useEffect(() => {
      setCanShowBoard(true);
    }, []);
      useEffect(() => {
        if (canShowBoard !== true) {
          return;
        }

    const fetchBoard =
      async (): Promise<void> => {
        try {
          setIsLoading(true);
          setError("");

          const serverUrl =
            import.meta.env.VITE_SERVER_URL.replace(
              /\/+$/,
              "",
            );

          const response = await fetch(
            `${serverUrl}/api/boards/${boardId}`,
            {
              credentials: "include",
            },
          );

          if (response.status === 401) {
            await navigate({
              to: "/login",
            });

            return;
          }

          if (response.status === 404) {
            setError("Board not found.");
            return;
          }

          if (!response.ok) {
            const data =
              (await response
                .json()
                .catch(() => null)) as
                | ErrorResponse
                | null;

            setError(
              data?.message ??
                data?.error ??
                "Failed to load board.",
            );

            return;
          }

          const data =
            (await response.json()) as BoardResponse;

          setBoard(data.board);

          setFormData({
            title: data.board.title,
            description:
              data.board.description ?? "",
          });
        } catch (fetchError: unknown) {
          console.error(
            "FETCH BOARD FAILED:",
            fetchError,
          );

          setError(
            "Something went wrong while loading the board.",
          );
        } finally {
          setIsLoading(false);
        }
      };

    void fetchBoard();
  }, [
    boardId,
    navigate,
    canShowBoard,
  ]);

  const handleStartEditing = (): void => {
    if (!board) {
      return;
    }

    setFormData({
      title: board.title,
      description:
        board.description ?? "",
    });

    setIsEditing(true);
    setError("");
  };

  const handleCancelEditing = (): void => {
    if (!board) {
      return;
    }

    setFormData({
      title: board.title,
      description:
        board.description ?? "",
    });

    setIsEditing(false);
    setError("");
  };

  const handleInputChange = (
    field: keyof UpdateBoardInput,
    value: string,
  ): void => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleUpdateBoard = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setError("");

    const result =
      updateBoardSchema.safeParse(
        formData,
      );

    if (!result.success) {
      const firstIssue =
        result.error.issues[0];

      setError(
        firstIssue?.message ??
          "Please check the entered data.",
      );

      return;
    }

    try {
      setIsSaving(true);

      const serverUrl =
        import.meta.env.VITE_SERVER_URL.replace(
          /\/+$/,
          "",
        );

      const response = await fetch(
        `${serverUrl}/api/boards/${boardId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(result.data),
        },
      );

      if (response.status === 401) {
        await navigate({
          to: "/login",
        });

        return;
      }

      if (!response.ok) {
        const data =
          (await response
            .json()
            .catch(() => null)) as
            | ErrorResponse
            | null;

        setError(
          data?.message ??
            data?.error ??
            "Failed to update board.",
        );

        return;
      }

      const data =
        (await response.json()) as BoardResponse;

      setBoard(data.board);

      setFormData({
        title: data.board.title,
        description:
          data.board.description ?? "",
      });

      setIsEditing(false);

      sessionStorage.setItem(
        "updated-board",
        JSON.stringify(data.board),
      );

      window.dispatchEvent(
        new CustomEvent("board-updated", {
          detail: data.board,
        }),
      );
    } catch (updateError: unknown) {
      console.error(
        "UPDATE BOARD FAILED:",
        updateError,
      );

      setError(
        "Something went wrong while updating the board.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBoard =
    async (): Promise<void> => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this board?",
      );

      if (!confirmed) {
        return;
      }

      try {
        setIsDeleting(true);
        setError("");

        const serverUrl =
          import.meta.env.VITE_SERVER_URL.replace(
            /\/+$/,
            "",
          );

        const response = await fetch(
          `${serverUrl}/api/boards/${boardId}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );

        if (response.status === 401) {
          await navigate({
            to: "/login",
          });

          return;
        }

        if (!response.ok) {
          const data =
            (await response
              .json()
              .catch(() => null)) as
              | ErrorResponse
              | null;

          setError(
            data?.message ??
              data?.error ??
              "Failed to delete board.",
          );

          return;
        }

        /**
         * Tell the Workspace that this board
         * has been deleted.
         */
        window.dispatchEvent(
          new CustomEvent("board-deleted", {
            detail: {
              id: Number(boardId),
              workspace_id:
                Number(workspaceId),
            },
          }),
        );

        await navigate({
          to: "/workspaces/$workspaceId",
          params: {
            workspaceId,
          },
          replace: true,
        });
      } catch (deleteError: unknown) {
        console.error(
          "DELETE BOARD FAILED:",
          deleteError,
        );

        setError(
          "Something went wrong while deleting the board.",
        );
      } finally {
        setIsDeleting(false);
      }
    };

  if (canShowBoard === null) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="relative overflow-hidden rounded-3xl bg-[#132f48] px-6 py-16 shadow-xl">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/20">
            <div className="h-10 w-10 animate-spin rounded-xl border-4 border-white/30 border-t-white" />
          </div>

          <h2 className="text-xl font-semibold text-white">
            Loading board...
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            Please wait while we load your board.
          </p>
        </div>
      </section>
    );
  }

  if (error && !board) {
    return (
      <section className="animate-[fadeIn_.4s_ease-out] rounded-3xl border border-red-200 bg-white p-8 shadow-xl dark:border-red-900 dark:bg-slate-900">
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/40">
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M12 9v4"
                strokeLinecap="round"
              />

              <path
                d="M12 17h.01"
                strokeLinecap="round"
              />

              <path
                d="M10.3 3.8 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Board not found
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (!board) {
    return null;
  }

  return (
    <section
      id="board-details"
      className="relative mt-10 overflow-hidden rounded-3xl bg-[#132f48] shadow-2xl ring-1 ring-white/10"
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/5 blur-3xl" />

      <div className="relative border-b border-white/10 px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 shadow-lg ring-1 ring-white/20 transition duration-300 hover:scale-105 hover:bg-white/15">
              <div className="relative h-9 w-9">
                <div className="absolute left-0 top-0 h-9 w-3 rounded-full bg-white" />

                <div className="absolute right-0 top-0 h-6 w-3 rounded-full bg-white/80" />
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Board Details
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                {board.title}
              </h2>

              <p className="mt-1 text-sm text-slate-300">
                Manage and update your board
              </p>
            </div>
          </div>

          {!isEditing && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleStartEditing}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#132f48] shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0"
              >
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-8deg]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 20h9"
                    strokeLinecap="round"
                  />

                  <path
                    d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"
                    strokeLinejoin="round"
                  />
                </svg>

                Edit Board
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleDeleteBoard()
                }
                disabled={isDeleting}
                className="group inline-flex items-center gap-2 rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M3 6h18"
                    strokeLinecap="round"
                  />

                  <path
                    d="M8 6V4h8v2"
                    strokeLinecap="round"
                  />

                  <path
                    d="m19 6-1 14H6L5 6"
                    strokeLinejoin="round"
                  />
                </svg>

                {isDeleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative px-6 py-8 sm:px-8">
        {error && (
          <div className="mb-6 animate-[fadeIn_.3s_ease-out] rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {isEditing ? (
          <form
            onSubmit={handleUpdateBoard}
            className="animate-[fadeInUp_.35s_ease-out]"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Edit Board
                </h3>

                <p className="mt-1 text-sm text-slate-300">
                  Update the title and description of
                  your board.
                </p>
              </div>

              <div>
                <label
                  htmlFor="board-title"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Board title
                </label>

                <input
                  id="board-title"
                  type="text"
                  value={formData.title}
                  onChange={(event) =>
                    handleInputChange(
                      "title",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-400 focus:border-white/30 focus:bg-white/15 focus:ring-2 focus:ring-white/10"
                  placeholder="Enter board title"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="board-description"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Description
                </label>

                <textarea
                  id="board-description"
                  value={
                    formData.description ?? ""
                  }
                  onChange={(event) =>
                    handleInputChange(
                      "description",
                      event.target.value,
                    )
                  }
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-400 focus:border-white/30 focus:bg-white/15 focus:ring-2 focus:ring-white/10"
                  placeholder="Enter board description"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Maximum 1000 characters.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#132f48] shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#132f48]/30 border-t-[#132f48]" />
                  )}

                  {isSaving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEditing}
                  disabled={isSaving}
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="animate-[fadeInUp_.45s_ease-out]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition duration-300 hover:bg-white/[0.07]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M4 5h16v14H4z"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M8 9h8M8 13h5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Description
                  </h3>

                  <p className="text-xs text-slate-400">
                    About this board
                  </p>
                </div>
              </div>

              <p className="leading-7 text-slate-300">
                {board.description?.trim()
                  ? board.description
                  : "No description has been added to this board yet."}
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08]">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Board ID
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  #{board.id}
                </p>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08]">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Workspace
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  #{board.workspace_id}
                </p>
              </div>
              <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08]">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Created
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {new Date(
                    board.created_at,
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}