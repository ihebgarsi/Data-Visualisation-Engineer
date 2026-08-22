import "./env";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles.css";

const mount = document.getElementById("app");
if (!mount) {
  throw new Error("Impossible de monter l'application.");
}

createRoot(mount).render(<App />);
