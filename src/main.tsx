import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SearchProducts from "./basic/lifecycle/componentDidUpdate";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SearchProducts />
  </StrictMode>
);
