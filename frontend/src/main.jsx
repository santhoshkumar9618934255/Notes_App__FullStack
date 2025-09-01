import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Master from "./pages/Master.jsx";
import Dashboard from "./components/Dashboard"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Master />
  </StrictMode>
);
