import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import App from "./App";
import "./styles/tokens.css";
import "./styles/global.css";

gsap.registerPlugin(TextPlugin);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
