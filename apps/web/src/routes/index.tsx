import { createFileRoute, Link ,useNavigate} from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/me`,
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
        console.error("Failed to get current user:", error);
      }
    };

    getCurrentUser();
  }, []);
  // Logout
const handleLogout = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,
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
            {user ? (
              // Show username when user is logged in
            <>  
              <span className="rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Welcome, {user.username}
              </span>
              <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
                >
                  Logout
                </button>
             </>
            ) : (
              // Show Login and Register when user is not logged in
              <>
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
              </>
            )}
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
