import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./generated/src/App.js";

if (import.meta.hot) {
  import.meta.hot.accept();
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
