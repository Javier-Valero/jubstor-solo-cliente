import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import Usuario from "./Usuario";
import KanbanTareas from "./KanbanTareas";
import RequireAuth from './RequireAuth';
import FormularioTareas from "./FormularioTareas";
import ListadoTareas from "./ListadoTareas";
import Login from "./Login";
import Registro from "./Registro";
import RutaDesconocida from "./RutaDesconocida";
import LoginPersistente from "./LoginPersistente";
import AuthContext from "../contexto/AuthProvider"

function Contenedor() {
    const { auth } = useContext(AuthContext);
    return (
        <Container>
            <Routes>
                {/* Rutas públicas */}
                <Route index path="/login" element={<Login />} />
                <Route index path="/registro" element={<Registro />} />

                {/* Embebemos estás rutas con el login persistente y las protegemos con RequireAuth */}
                <Route element={<LoginPersistente />}>
                    <Route element={<RequireAuth />}>
                        <Route path="/" element={auth?.user?.vista === 'listado' ? <ListadoTareas /> : <KanbanTareas />} />
                    </Route>
                    <Route element={<RequireAuth />}>
                        <Route path="/tareas" element={<ListadoTareas />} />
                    </Route>
                    <Route element={<RequireAuth />}>
                        <Route path="/kanban" element={<KanbanTareas />} />
                    </Route>
                    <Route element={<RequireAuth />}>
                        <Route path="/usuario" element={<Usuario />} />
                    </Route>
                    <Route element={<RequireAuth />}>
                        <Route path="/tareas/nueva" element={<FormularioTareas />} />
                    </Route>
                    <Route element={<RequireAuth />}>
                        <Route path="/tareas/:idtarea/editar" element={<FormularioTareas />} />
                    </Route>
                </Route>

                {/* Cualquier ruta */}
                <Route path='*' element={<RutaDesconocida />} />
            </Routes>
        </Container>
    );
}

export default Contenedor;