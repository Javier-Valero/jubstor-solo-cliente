
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from './contexto/AuthProvider';
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    {/* Emmbebemos el componente App dentro de AuthProvider para poder usarlo para los permisos. */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
