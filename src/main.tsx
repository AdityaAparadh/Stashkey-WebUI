// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/Hooks/useTheme.tsx";
import { AuthProvider } from "./components/Hooks/useAuth.tsx";
import { PageProvider } from "./components/Hooks/usePage.tsx";
import { VaultProvider } from "./components/Hooks/useVault.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ThemeProvider defaultTheme="system" storageKey="global_theme">
    <AuthProvider>
      <PageProvider>
        <VaultProvider>
          <App />
        </VaultProvider>
      </PageProvider>
    </AuthProvider>
  </ThemeProvider>,
  // </StrictMode>,
);
