import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useForm } from "@tanstack/react-form";

import { registerUserSchema } from "@trello-clone/schemas";

import { Button } from "@trello-clone/ui/components/button";

import { Card } from "@trello-clone/ui/components/card";

import { Input } from "@trello-clone/ui/components/input";

import { Label } from "@trello-clone/ui/components/label";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

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
        const serverUrl =
          import.meta.env.VITE_SERVER_URL.replace(
            /\/+$/,
            "",
          );

        const response = await fetch(
          `${serverUrl}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: value.username,
              email: value.email,
              password: value.password,
              confirmPassword: value.confirmPassword,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          form.setErrorMap({
            onSubmit: {
              form:
                data.message || "Registration failed",
              fields: {},
            },
          });

          return;
        }

        navigate({ to: "/login" });
      } catch {
        form.setErrorMap({
          onSubmit: {
            form: "Unable to connect to server",
            fields: {},
          },
        });
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <Card className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create your account to get started
          </p>
        </div>

        <form.Subscribe
          selector={(state) => state.errorMap.onSubmit}
          children={(onSubmitError) => {
            const formError = (
              onSubmitError as
                | {
                    form?: string;
                  }
                | undefined
            )?.form;

            if (!formError) {
              return null;
            }

            return (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
                {formError}
              </div>
            );
          }}
        />

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-5"
        >
          <form.Field
            name="username"
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Username
                </Label>

                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Enter your username"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  className="h-10 rounded-lg px-4 py-2.5 text-sm"
                />

                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
              </div>
            )}
          />

          <form.Field
            name="email"
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Email
                </Label>

                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="Enter your email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  className="h-10 rounded-lg px-4 py-2.5 text-sm"
                />

                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
              </div>
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
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
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  className="h-10 rounded-lg px-4 py-2.5 text-sm"
                />

                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
              </div>
            )}
          />

          <form.Field
            name="confirmPassword"
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Confirm Password
                </Label>

                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="Confirm your password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  className="h-10 rounded-lg px-4 py-2.5 text-sm"
                />

                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
              </div>
            )}
          />

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
                size="lg"
                className="w-full rounded-lg"
                disabled={
                  !canSubmit || isSubmitting
                }
              >
                {isSubmitting
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>
            )}
          />
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Login
          </a>
        </p>
      </Card>
    </div>
  );
}