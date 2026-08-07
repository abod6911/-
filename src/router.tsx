import { QueryClient } from "@tanstack/react-query";
import { createRouter, createHashHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // Dynamically detect GitHub Pages repository subpath (e.g. /-/ or /repo-name)
  let basepath: string | undefined = undefined;
  if (typeof window !== "undefined" && window.location.hostname.includes("github.io")) {
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts.length > 0) {
      basepath = `/${parts[0]}`;
    }
  }

  const router = createRouter({
    routeTree,
    basepath,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
