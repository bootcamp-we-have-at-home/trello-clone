import { createFileRoute,useNavigate } from "@tanstack/react-router";
import { useState } from "react";
// Create the /register route
export const Route = createFileRoute("/register")({
  component: RegisterPage,
});
// Register page component
function RegisterPage() {
  // Navigation
  const navigate = useNavigate();
  // Register form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Confirm password state
  const [confirmPassword, setConfirmPassword] = useState("");
  // Request state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validation state
  const [validationError, setValidationError] = useState("");

  // Handle form submission
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    // Clear previous validation errors
    setValidationError("");

    // Validate username
    if (!username.trim()) {
      setValidationError("Username is required");
      return;
    }

    // Validate email
    if (!email.trim()) {
      setValidationError("Email is required");
      return;
    }

    // Check email format
    if (!email.includes("@")) {
      setValidationError("Please enter a valid email");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }
    // Validate confirm password
    if (confirmPassword !== password) {
      setValidationError("Passwords do not match");
      return;
  }

    // Start loading state
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Send registration request to the backend
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          // Tell the server that we are sending JSON
          headers: {
            "Content-Type": "application/json",
          },

          // Convert form data to JSON
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        },
      );

      // Convert server response to JSON
      const data = await response.json();

      // Handle failed response
      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }
      // Show success message
      setSuccess("Account created successfully!");
      // Display response in the browser console
      console.log(data);
      // Navigate to login page after a short delay
      setTimeout(() => {
      navigate({ to: "/login" });
      }, 1000);
    } catch {
      // Handle server connection errors
      setError("Unable to connect to server");
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };
  return (
    // Page background
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 transition-colors dark:bg-slate-950">
      {/* Register card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition-colors dark:border-slate-700 dark:bg-slate-900">
        {/* Page header */}
        <div className="mb-8 text-center">
          
          {/* Page title */}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Create Account
          </h1>
          {/* Page description */}
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create your account to get started
          </p>
        </div>
        {/* Server error message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}
        {/* Validation error message */}
        {validationError && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-400">
            {validationError}
          </div>
        )}
        {/* Success message */}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400">
            {success}
          </div>
        )}
        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username field */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
            />
          </div>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
            />
          </div>
          {/* Confirm password field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
            />
          </div>
          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 dark:focus:ring-offset-slate-900"
          >
            {/* Change button text while submitting */}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        {/* Login link */}
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}