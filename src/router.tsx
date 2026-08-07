import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // Detect GitHub Pages subpath (e.g., /-/ or /repo-name)
  let basepath: string | undefined = undefined;
  if (typeof window !== "undefined" && window.location.hostname.includes("github.io")) {
    const segments = window.location.pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      basepath = `/${segments[0]}`;
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
