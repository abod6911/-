import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";

const container = document.getElementById("root") || document.body;
const router = getRouter();

createRoot(container).render(<RouterProvider router={router} />);
