import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { loadSettings } from "./utils/storage";
import { applyTheme } from "./utils/theme";
import { ensureWords } from "./utils/loadWords";

applyTheme(loadSettings().theme);

const root = createRoot(document.getElementById("root")!);
root.render(
  <div className="flex min-h-dvh items-center justify-center font-semibold text-indigo-700">
    Loading vocabulary…
  </div>,
);

void ensureWords().then(() => {
  root.render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>,
  );
});
