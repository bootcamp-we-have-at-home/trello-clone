import { createFileRoute } from "@tanstack/react-router";

// Create the /login route
export const Route = createFileRoute("/login")({
  component: LoginPage,
});

// Login page component
function LoginPage() {
  return (
    // Page background
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 transition-colors dark:bg-slate-950">

      {/* Login card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition-colors dark:border-slate-700 dark:bg-slate-900">

        {/* Page header */}
        <div className="mb-8 text-center">

          {/* Page title */}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome Back
          </h1>

          {/* Page description */}
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Login to your account to continue
          </p>
        </div>

        {/* Login form */}
        <form className="space-y-5">

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
            />
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-slate-900"
          >
            Login
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}

          <a
            href="/register"
            className="font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}