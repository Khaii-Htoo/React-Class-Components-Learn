import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Counter from "./basic/counter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Counter title="hello counter" />
  </StrictMode>
);
