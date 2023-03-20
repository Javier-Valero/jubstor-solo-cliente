import React, { } from "react";
import Contenedor from "./componentes/Contenedor";
import Menu from "./componentes/Navbar";
import { AppProvider } from "./contexto/ContextoApp";
import { BrowserRouter } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      {/* Emmbebemos los componentes superiores de la app dentro de AppProvider para poder compartir datos y funciones comunes en los compenentes hijos. */}
      <AppProvider>
        <Menu />
        <Contenedor />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
