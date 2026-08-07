import { createRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

const container = document.getElementById("root") || document.body;

createRoot(container).render(<StartClient />);
