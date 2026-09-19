import { Link } from "@tanstack/react-router";

import { ModeToggle } from "./mode-toggle";
const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/workspaces", label: "Workspaces" },
] as const;

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          Trello Clone
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              activeProps={{
                className:
                  "rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white",
              }}
              inactiveProps={{
                className:
                  "rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Theme */}
        <ModeToggle />
      </div>
    </header>
  );
}