import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
`;

// Create the home route
export const Route = createFileRoute("/")({
  component: HomeComponent,
});

// Home page component
function HomeComponent() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">

          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-slate-900 dark:text-white"
          >
            Trello Clone
          </Link>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3">

            {/* Login button */}
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Login
            </Link>

            {/* Register button */}
            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Register
            </Link>

          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto max-w-3xl px-4 py-8">

        {/* ASCII Logo */}
        <pre className="overflow-x-auto font-mono text-sm text-slate-900 dark:text-white">
          {TITLE_TEXT}
        </pre>

        {/* API Status */}
        <div className="mt-6 grid gap-6">
          <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">

            <h2 className="mb-2 font-medium text-slate-900 dark:text-white">
              API Status
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Trello Clone API is running.
            </p>

          </section>
        </div>
      </main>
    </div>
  );
}