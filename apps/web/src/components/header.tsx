import { Link } from "@tanstack/react-router";

import { ModeToggle } from "./mode-toggle";
const links = [
  { to: "/", label: "Home", shortLabel: "H" },
  { to: "/dashboard", label: "Dashboard", shortLabel: "D" },
  { to: "/workspaces", label: "Workspaces", shortLabel: "W" },
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
          {links.map(({ to, label, shortLabel }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{
                className:
                  "rounded-md bg-white px-2 py-2 text-sm font-medium text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white sm:px-3",
              }}
              inactiveProps={{
                className:
                  "rounded-md px-2 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:px-3",
              }}
            >
              <span className="sm:hidden">{shortLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Theme */}
        <ModeToggle />
      </div>
    </header>
  );
}