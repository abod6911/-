import { QueryClient } from "@tanstack/react-query";
import { createRouter, createHashHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const isGithubPages = typeof window !== "undefined" && window.location.hostname.includes("github.io");

  const router = createRouter({
    routeTree,
    basepath: isGithubPages ? "/-" : undefined,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
