import { createRoot } from "react-dom/client";
import { MyRouter } from "./app/Router.tsx";

import "./index.css";
import { CssVarsProvider } from "@mui/joy";

createRoot(document.getElementById("root")!).render(
  <CssVarsProvider>
    <MyRouter />
  </CssVarsProvider>
);
