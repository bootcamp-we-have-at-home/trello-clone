import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import type {
  ChangeEvent,
  FormEvent,
} from "react";

import { loginSchema } from "@trello-clone/schemas";
import { Button } from "@trello-clone/ui/components/button";
import { Input } from "@trello-clone/ui/components/input";
import { Label } from "@trello-clone/ui/components/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    validators: {
      onSubmit: loginSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        const serverUrl =
          import.meta.env.VITE_SERVER_URL.replace(
            /\/+$/,
            "",
          );

        const response = await fetch(
          `${serverUrl}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(value),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Login failed",
          );
        }

        navigate({
          to: "/dashboard",
        });
      } catch (error) {
        console.error("Login error:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to connect to server";

        form.setErrorMap({
          onSubmit: {
            form: message,
            fields: {},
          },
        });
      }
    },
  });

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <main className="flex min-h-full items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-sm dark:bg-white dark:text-slate-900">
                ✓
              </span>

              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Trello Clone
              </span>
            </Link>

            <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Sign in to continue to your account
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <form
              onSubmit={(
                event: FormEvent<HTMLFormElement>,
              ) => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
              className="space-y-5"
            >
              {/* Form error */}
              {form.state.errors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  {String(
                    (
                      form.state.errorMap.onSubmit as
                        | {
                            form?: string;
                          }
                        | undefined
                    )?.form ?? "Login failed",
                  )}
                </div>
              )}

              {/* Email */}
              <form.Field
                name="email"
                children={(field) => {
                  const errors = field.state.meta.errors;

                  return (
                    <div className="space-y-2">
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Email
                      </Label>

                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="you@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>,
                        ) => {
                          field.handleChange(
                            event.target.value,
                          );
                        }}
                        aria-invalid={
                          errors.length > 0
                        }
                        className="h-11"
                      />

                      {errors.length > 0 && (
                        <p className="text-xs text-red-500">
                          {errors[0]?.message}
                        </p>
                      )}
                    </div>
                  );
                }}
              />

              {/* Password */}
              <form.Field
                name="password"
                children={(field) => {
                  const errors = field.state.meta.errors;

                  return (
                    <div className="space-y-2">
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Password
                      </Label>

                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        placeholder="Enter your password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>,
                        ) => {
                          field.handleChange(
                            event.target.value,
                          );
                        }}
                        aria-invalid={
                          errors.length > 0
                        }
                        className="h-11"
                      />

                      {errors.length > 0 && (
                        <p className="text-xs text-red-500">
                          {errors[0]?.message}
                        </p>
                      )}
                    </div>
                  );
                }}
              />

              {/* Submit button */}
              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                ]}
                children={([
                  canSubmit,
                  isSubmitting,
                ]) => (
                  <Button
                    type="submit"
                    disabled={
                      !canSubmit || isSubmitting
                    }
                    className="h-11 w-full"
                  >
                    {isSubmitting
                      ? "Signing in..."
                      : "Sign in"}
                  </Button>
                )}
              />

              {/* Register */}
              <div className="border-t border-slate-100 pt-5 text-center dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-slate-900 hover:underline dark:text-white"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Back Home */}
          <div className="mt-5 text-center">
            <Link
              to="/"
              className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}