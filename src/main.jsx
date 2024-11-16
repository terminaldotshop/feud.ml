import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Greeting from "./generated/src/Example.js";

if (import.meta.hot) {
  import.meta.hot.accept();
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Greeting />
  </StrictMode>,
);
