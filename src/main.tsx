import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import QuantumSimulator from "./App.tsx";

// import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QuantumSimulator />
  </StrictMode>
);
