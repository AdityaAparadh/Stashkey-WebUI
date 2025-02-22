import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/Hooks/useTheme.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ThemeProvider defaultTheme="system" storageKey="global_theme">
    <App />
  </ThemeProvider>,
  // </StrictMode>,
);
