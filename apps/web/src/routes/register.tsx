import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";

import { registerUserSchema } from "@trello-clone/schemas";
import { Button } from "@trello-clone/ui/components/button";

// Create the /register route
export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

// Register page component
function RegisterPage() {
  // Navigation
  const navigate = useNavigate();

  // Register form
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validators: {
      onChange: registerUserSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        // Send registration request to the backend
        const response = await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: value.username,
              email: value.email,
              password: value.password,
            }),
          },
        );

        // Convert server response to JSON
        const data = await response.json();

        // Handle failed response
        if (!response.ok) {
          console.error(data.message || "Registration failed");
          return;
        }

        // Navigate to login page after successful registration
        navigate({ to: "/login" });
      } catch (error) {
        console.error("Unable to connect to server", error);
      }
    },
  });

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

        {/* Registration form */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            form.handleSubmit();
          }}
          className="space-y-5"
        >
          {/* Username field */}
          <form.Field
            name="username"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Username
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Enter your username"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                />

                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {String(field.state.meta.errors[0]?.message)}
                    </p>
                  )}
              </div>
            )}
          />

          {/* Email field */}
          <form.Field
            name="email"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Email
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="Enter your email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                />

                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {String(field.state.meta.errors[0]?.message)}
                    </p>
                  )}
              </div>
            )}
          />

          {/* Password field */}
          <form.Field
            name="password"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="Enter your password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                />

                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {String(field.state.meta.errors[0]?.message)}
                    </p>
                  )}
              </div>
            )}
          />

          {/* Confirm password field */}
          <form.Field
            name="confirmPassword"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Confirm Password
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="Confirm your password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                />

                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {String(field.state.meta.errors[0]?.message)}
                    </p>
                  )}
              </div>
            )}
          />

          {/* Submit button */}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>
            )}
          />
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