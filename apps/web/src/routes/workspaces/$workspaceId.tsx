import {
  createFileRoute,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";

import { useEffect, useState } from "react";

import type {
  ChangeEvent,
  FormEvent,
  MouseEvent,
} from "react";

import { createBoardSchema } from "@trello-clone/schemas";

type Workspace = {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  created_at: string;
  updated_at: string;
  role: "admin" | "member";
};

type Board = {
  id: number;
  title: string;
  workspace_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  description: string | null;
};

type WorkspaceResponse = {
  workspace: Workspace;
};

type BoardsResponse = {
  boards: Board[];
};

type ErrorResponse = {
  message?: string;
};

export const Route = createFileRoute(
  "/workspaces/$workspaceId",
)({
  component: WorkspaceDetailsPage,
});

function WorkspaceDetailsPage() {
  const navigate = useNavigate();

  const { workspaceId } =
    Route.useParams();

  const [workspace, setWorkspace] =
    useState<Workspace | null>(null);

  const [boards, setBoards] =
    useState<Board[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [boardTitle, setBoardTitle] =
    useState("");

  const [boardDescription, setBoardDescription] =
    useState("");

  const [creatingBoard, setCreatingBoard] =
    useState(false);

  const [boardError, setBoardError] =
    useState<string | null>(null);

  /**
   * Fetch workspace and boards
   */
  useEffect(() => {
    const controller =
      new AbortController();

    const fetchWorkspaceData =
      async (): Promise<void> => {
        try {
          setLoading(true);
          setError(null);

          const serverUrl =
            import.meta.env.VITE_SERVER_URL.replace(
              /\/+$/,
              "",
            );

          const [
            userResponse,
            workspaceResponse,
            boardsResponse,
          ] = await Promise.all([
            fetch(`${serverUrl}/api/auth/me`, {
              credentials: "include",
              signal: controller.signal,
            }),

            fetch(
              `${serverUrl}/api/workspaces/${workspaceId}`,
              {
                credentials: "include",
                signal: controller.signal,
              },
            ),

            fetch(
              `${serverUrl}/api/boards?workspaceId=${workspaceId}`,
              {
                credentials: "include",
                signal: controller.signal,
              },
            ),
          ]);

          if (
            userResponse.status === 401 ||
            workspaceResponse.status === 401 ||
            boardsResponse.status === 401
          ) {
            await navigate({
              to: "/login",
            });

            return;
          }

          if (!workspaceResponse.ok) {
            const workspaceError =
              (await workspaceResponse.json()) as ErrorResponse;

            setError(
              workspaceError.message ??
                `Unable to fetch workspace. Status: ${workspaceResponse.status}`,
            );

            return;
          }

          if (!boardsResponse.ok) {
            const boardsError =
              (await boardsResponse.json()) as ErrorResponse;

            setError(
              boardsError.message ??
                "Unable to fetch boards.",
            );

            return;
          }

          const workspaceData =
            (await workspaceResponse.json()) as WorkspaceResponse;

          const boardsData =
            (await boardsResponse.json()) as BoardsResponse;

          if (controller.signal.aborted) {
            return;
          }

          setWorkspace(
            workspaceData.workspace,
          );

          setBoards(boardsData.boards);
        } catch (fetchError: unknown) {
          if (
            fetchError instanceof DOMException &&
            fetchError.name === "AbortError"
          ) {
            return;
          }

          console.error(
            "Fetching workspace data failed:",
            fetchError,
          );

          setError(
            "Unable to connect to server. Please try again later.",
          );
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      };

    void fetchWorkspaceData();

    return () => {
      controller.abort();
    };
  }, [navigate, workspaceId]);

  /**
   * Listen for board updates and deletes
   */
  useEffect(() => {
    const handleBoardUpdated = (
      event: Event,
    ): void => {
      const customEvent =
        event as CustomEvent<Board>;

      const updatedBoard =
        customEvent.detail;

      if (!updatedBoard) {
        return;
      }

      if (
        updatedBoard.workspace_id !==
        Number(workspaceId)
      ) {
        return;
      }

      setBoards((currentBoards) =>
        currentBoards.map((currentBoard) =>
          currentBoard.id === updatedBoard.id
            ? {
                ...currentBoard,
                ...updatedBoard,
              }
            : currentBoard,
        ),
      );
    };

    const handleBoardDeleted = (
      event: Event,
    ): void => {
      const customEvent =
        event as CustomEvent<{
          id: number;
          workspace_id: number;
        }>;

      const deletedBoard =
        customEvent.detail;

      if (!deletedBoard) {
        return;
      }

      if (
        deletedBoard.workspace_id !==
        Number(workspaceId)
      ) {
        return;
      }

      setBoards((currentBoards) =>
        currentBoards.filter(
          (currentBoard) =>
            currentBoard.id !==
            deletedBoard.id,
        ),
      );
    };

    window.addEventListener(
      "board-updated",
      handleBoardUpdated,
    );

    window.addEventListener(
      "board-deleted",
      handleBoardDeleted,
    );

    return () => {
      window.removeEventListener(
        "board-updated",
        handleBoardUpdated,
      );

      window.removeEventListener(
        "board-deleted",
        handleBoardDeleted,
      );
    };
  }, [workspaceId]);

  /**
   * Create board
   */
  const handleCreateBoard = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setBoardError(null);

    const validationResult =
      createBoardSchema.safeParse({
        title: boardTitle.trim(),
        description:
          boardDescription.trim(),
        workspaceId: Number(workspaceId),
      });

    if (!validationResult.success) {
      setBoardError(
        validationResult.error.issues[0]?.message ??
          "Invalid board data.",
      );

      return;
    }

    try {
      setCreatingBoard(true);

      const serverUrl =
        import.meta.env.VITE_SERVER_URL.replace(
          /\/+$/,
          "",
        );

      const response = await fetch(
        `${serverUrl}/api/boards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(
            validationResult.data,
          ),
        },
      );

      const data =
        (await response.json()) as
          | { board: Board }
          | ErrorResponse;

      if (response.status === 401) {
        await navigate({
          to: "/login",
        });

        return;
      }

      if (!response.ok) {
        const errorData =
          data as ErrorResponse;

        setBoardError(
          errorData.message ??
            "Failed to create board.",
        );

        return;
      }

      const boardData =
        data as { board: Board };

      setBoards((currentBoards) => [
        boardData.board,
        ...currentBoards,
      ]);

      setBoardTitle("");
      setBoardDescription("");
    } catch (error: unknown) {
      console.error(
        "Creating board failed:",
        error,
      );

      setBoardError(
        "Unable to connect to server. Please try again later.",
      );
    } finally {
      setCreatingBoard(false);
    }
  };

  /**
   * Open Board Details
   */
  const handleOpenBoard = async (
    event: MouseEvent<HTMLButtonElement>,
    boardId: number,
  ): Promise<void> => {
    event.preventDefault();

    try {
      sessionStorage.setItem(
        `board-opened-${boardId}`,
        "true",
      );

      await navigate({
        to: "/workspaces/$workspaceId/boards/$boardId",
        params: {
          workspaceId,
          boardId: String(boardId),
        },
      });
    } catch (error: unknown) {
      console.error(
        "NAVIGATION FAILED:",
        error,
      );
    }
  };

  /**
   * Loading
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Loading workspace...
          </div>
        </div>
      </main>
    );
  }

  /**
   * Error
   */
  if (
    error !== null ||
    workspace === null
  ) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/workspaces",
              })
            }
            className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            ← Back to Workspaces
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            {error ?? "Workspace not found."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/workspaces",
            })
          }
          className="mb-6 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          ← Back to Workspaces
        </button>

        {/* Workspace */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {workspace.name}
              </h1>

              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {workspace.description ??
                  "No description provided."}
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {workspace.role}
            </span>
          </div>
        </section>

        {/* Create Board */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Create Board
          </h2>

          <form
            onSubmit={handleCreateBoard}
            className="mt-5 flex flex-col gap-3"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={boardTitle}
                onChange={(
                  event: ChangeEvent<HTMLInputElement>,
                ) =>
                  setBoardTitle(
                    event.target.value,
                  )
                }
                placeholder="Board title"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />

              <input
                type="text"
                value={boardDescription}
                onChange={(
                  event: ChangeEvent<HTMLInputElement>,
                ) =>
                  setBoardDescription(
                    event.target.value,
                  )
                }
                placeholder="Description"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={creatingBoard}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-fit"
            >
              {creatingBoard
                ? "Creating..."
                : "Create Board"}
            </button>
          </form>

          {boardError !== null && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">
              {boardError}
            </p>
          )}
        </section>

        {/* Boards */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Boards
            </h2>

            <span className="text-sm text-slate-500 dark:text-slate-400">
              {boards.length} board
              {boards.length === 1
                ? ""
                : "s"}
            </span>
          </div>

          {boards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <p className="text-slate-600 dark:text-slate-400">
                This workspace does not have
                any boards yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {boards.map((board) => (
                <article
                  key={board.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {board.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {board.description?.trim()
                      ? board.description
                      : "No description"}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Board #{board.id}
                  </p>

                  <button
                    type="button"
                    onClick={(event) =>
                      void handleOpenBoard(
                        event,
                        board.id,
                      )
                    }
                    className="mt-4 w-full rounded-lg bg-slate-100 px-4 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Open Board →
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <Outlet />
      </div>
    </main>
  );
}