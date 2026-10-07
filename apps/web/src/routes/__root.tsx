import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@trello-clone/ui/components/sonner";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";

import "../index.css";

export interface RouterAppContext {}
export const Route =
  createRootRouteWithContext<RouterAppContext>()({
    component: RootComponent,

    head: () => ({
      meta: [
        {
          title: "trello-clone",
        },

        {
          name: "description",
          content: "trello-clone is a web application",
        },
      ],

      links: [
        {
          rel: "icon",
          href: "/favicon.ico",
        },
      ],
    }),
  });

function RootComponent() {
  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="grid h-svh grid-rows-[auto_1fr] bg-[#132f48]">
          <Header />

          <main className="min-h-0 overflow-auto scroll-smooth bg-[#132f48]">
            <Outlet />
          </main>
        </div>
        <Toaster richColors />
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}