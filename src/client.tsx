import { hydrateRoot, createRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

const container = document.getElementById("root") || document.body;

if (container.hasChildNodes() && container.innerHTML.trim().length > 0) {
  hydrateRoot(container, <StartClient />);
} else {
  createRoot(container).render(<StartClient />);
}
