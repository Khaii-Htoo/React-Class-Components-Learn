import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import BasicLifecycle from "./basic/lifecycle/allLifecycle";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BasicLifecycle />
  </StrictMode>
);
