import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SimpleProducts from "./basic/lifecycle/componentDidMount";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SimpleProducts />
  </StrictMode>
);
