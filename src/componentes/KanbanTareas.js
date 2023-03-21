import React, { useState, useEffect } from "react";
import useContextoApp from '../hooks/useContextoApp';
import ConfirmarBorrar from './ConfirmarBorrar';
import { Box } from "@mui/material";
import { DragDropContext } from "react-beautiful-dnd";
import Columna from "./Columna";

const KanbanTareas = () => {
    // Declaramos o importamos las variables y funciones necesarias 
    const { bearer, compruebaErrorSesion, excepcionSesion, handleCerrarModalDeleteTarea, miscolumnas, user, setNombrePantalla, idtareaBorrar, server_url } = useContextoApp();
    setNombrePantalla('Kanban de tareas')
    const [columnas, setColumnas] = useState([]);

    const cargaTareas = async () => {
        // Hacemos la solicitud al servidor
        try {
            const response = await fetch(`${server_url}/tareas/${user.idusuario}`,
                {
                    method: "GET",
                    headers: { 'Authorization': bearer },
                    credentials: 'same-origin',
                });
            const tareas = await response.json();
            compruebaErrorSesion(response)
            // Colocamos cada tarea en su columna
            for (let tarea of tareas) {
                for (let col in miscolumnas) {
                    if (tarea.estado === miscolumnas[col].nombre) {
                        miscolumnas[col].tareas.push(tarea)
                    }
                }

            }
            setColumnas(miscolumnas);
        } catch (error) {
            console.error(error);
            excepcionSesion(error)
        }

    };

    useEffect(() => {
        cargaTareas();
    }, []);



    const onDragEnd = (result, columnas, setColumnas) => {
        moverEnCliente(result, columnas, setColumnas)
        moverEnbbdd(result, columnas, setColumnas)
    };

    const moverEnbbdd = async (result, columnas, setColumnas) => {
        const { source, destination } = result
        const idtarea = result.draggableId
        const datosMover = { estadoDestino: destination.droppableId, estadoOrigen: source.droppableId, ordencolDestino: destination.index, ordencolOrigen: source.index, idusuario: user.idusuario }
        try {
            // Hacemos la solicitud al servidor
            const response = await fetch(
                `${server_url}/tareas/ordenestado/${idtarea}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", 'Authorization': bearer },
                    body: JSON.stringify(datosMover),
                    credentials: 'same-origin',
                }
            );
            await response.json();
            compruebaErrorSesion(response)
            if (response.status < 200 || response.status > 300) { cargaTareas() }
        } catch (error) {
            console.error(error);
            excepcionSesion(error)
        }
    };

    const moverEnCliente = (result, columnas, setColumnas) => {
        const { source, destination } = result
        let nuevasColumnas = columnas

        if (source.droppableId !== destination.droppableId) {
            // La tarea va una columna nueva, la sacamos de la suya y la agregamos a la nueva en su nueva posición
            const columnaOrigen = columnas[source.droppableId]
            const columnaDestino = columnas[destination.droppableId]
            const tareasOrigen = [...columnaOrigen.tareas]
            const tareasDestino = [...columnaDestino.tareas]
            let [tareaSaliente] = tareasOrigen.splice(source.index, 1)
            tareasDestino.splice(destination.index, 0, tareaSaliente)
            nuevasColumnas[source.droppableId] = {
                ...columnaOrigen,
                tareas: tareasOrigen
            }
            nuevasColumnas[destination.droppableId] = {
                ...columnaDestino,
                tareas: tareasDestino
            }
        } else {
            // Actualizamos la posición de la tarea en su columna
            const columnaDestino = columnas[destination.droppableId]
            const tareasDestino = [...columnaDestino.tareas]
            let [tareaSaliente] = tareasDestino.splice(source.index, 1)
            tareasDestino.splice(destination.index, 0, tareaSaliente)
            nuevasColumnas[destination.droppableId] = {
                ...columnaDestino,
                tareas: tareasDestino
            }
        }

        let miscolumnasAUX = []
        for (let col in columnas) {
            miscolumnasAUX[col] = nuevasColumnas[col]
        }
        setColumnas(miscolumnasAUX);
    };

    const confirmarBorrarTareaClicked = async () => {
        try {
            // Hacemos la solicitud al servidor
            const response = await fetch(`${server_url}/tareas/${idtareaBorrar}`, {
                method: "DELETE",
                headers: { 'Authorization': bearer },
                credentials: 'same-origin',
            });
            await response.json();
            compruebaErrorSesion(response)
            cargaTareas();
        } catch (error) {
            console.error(error);
            excepcionSesion(error)
        } finally {
            handleCerrarModalDeleteTarea()
        }
    };

    return (
        <Box style={{ display: "flex", justifyContent: "center", height: "100%" }}>
            <DragDropContext
                onDragEnd={(result) => onDragEnd(result, columnas, setColumnas)}
            >
                {Object.entries(columnas).map(([columnaId, columna], index) => {
                    return (
                        <Box
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                marginTop: '20px'
                            }}
                            key={columnaId}
                        >
                            <Box style={{ margin: 8 }}>
                                <Columna
                                    droppableId={columnaId}
                                    key={columnaId}
                                    index={index}
                                    columna={columna}
                                />
                            </Box>
                        </Box>
                    );
                })}
            </DragDropContext>
            <ConfirmarBorrar callbackConfirmar={() => confirmarBorrarTareaClicked()} />
        </Box>
    );
};

export default KanbanTareas;