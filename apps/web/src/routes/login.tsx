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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@trello-clone/ui/components/card";
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
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
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
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Welcome Back
          </CardTitle>

          <CardDescription>
            Login to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
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
            {/* Email */}
            <form.Field
              name="email"
              children={(field) => {
                const errors = field.state.meta.errors;

                return (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>
                      Email
                    </Label>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="Enter your email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(
                        event: ChangeEvent<HTMLInputElement>,
                      ) => {
                        field.handleChange(
                          event.target.value,
                        );
                      }}
                      aria-invalid={errors.length > 0}
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
                    <Label htmlFor={field.name}>
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
                      aria-invalid={errors.length > 0}
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
                  className="w-full"
                >
                  {isSubmitting
                    ? "Logging in..."
                    : "Login"}
                </Button>
              )}
            />

            {/* Register link */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}