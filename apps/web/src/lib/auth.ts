import { redirect } from "@tanstack/react-router";

export const requireAuth = async () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL.replace(
    /\/+$/,
    "",
  );

  const response = await fetch(`${serverUrl}/api/auth/me`, {
    credentials: "include",
  });

  if (response.status === 401) {
    throw redirect({
      to: "/login",
    });
  }

  if (!response.ok) {
    throw new Error("Unable to verify authentication.");
  }
};