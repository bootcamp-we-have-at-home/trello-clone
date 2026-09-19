import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workspaces")({
  component: WorkspacesPage,
});

function WorkspacesPage() {
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <h1 className="text-3xl font-bold">My Workspaces</h1>
    </div>
  );
}