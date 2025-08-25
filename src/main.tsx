import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ProductDashboard from "./Products";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProductDashboard />
  </StrictMode>
);
