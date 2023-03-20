import React, { useState, useEffect } from "react";
import useContextoApp from '../hooks/useContextoApp';
import ConfirmarBorrar from './ConfirmarBorrar';
import { Box, Grid, Typography, IconButton, Icon, Tooltip } from "@mui/material";

const ListadoTareas = () => {
    // Declaramos o importamos las variables y funciones necesarias 
    const { bearer, compruebaErrorSesion, excepcionSesion, handleAbrirModalDeleteTarea, handleCerrarModalDeleteTarea, handleEdit, miscolumnas, user, setNombrePantalla, idtareaBorrar } = useContextoApp();
    setNombrePantalla('Listado de tareas')
    const [tareas, setTareas] = useState([]);


    const cargaTareas = async () => {
        // Hacemos la solicitud al servidor
        try {
            const response = await fetch("http://localhost:4000/tareas/" + user.idusuario,
                {
                    method: "GET",
                    headers: { 'Authorization': bearer },
                    credentials: 'same-origin',
                });
            const data = await response.json();
            compruebaErrorSesion(response)
            setTareas(data);
        } catch (error) {
            console.error(error);
            excepcionSesion(error)
        }

    };

    const confirmarBorrarTareaClicked = async () => {
        // Hacemos la solicitud al servidor
        try {
            const response = await fetch(`http://localhost:4000/tareas/${idtareaBorrar}`, {
                method: "DELETE",
                headers: { 'Authorization': bearer },
                credentials: 'same-origin',
            });
            await response.json();
            compruebaErrorSesion(response)
            if (response.status < 200 || response.status > 300) {
                cargaTareas()
            } else {
                setTareas(tareas.filter((tarea) => tarea.idtarea !== idtareaBorrar));
            }
        } catch (error) {
            console.error(error);
            excepcionSesion(error)
        } finally {
            handleCerrarModalDeleteTarea()
        }
    };

    useEffect(() => {
        // Cargamos las tareas al entrar en la vista
        cargaTareas();
    }, []);

    return (
        <Box mt={2} style={{ marginTop: '20px' }}>
            {tareas?.map((tarea) =>
                <Grid container key={tarea.idtarea}
                    style={{
                        marginBottom: ".7rem",
                        padding: ".7rem",
                        backgroundColor: "white",
                        borderRadius: '20px',
                        border: `2px solid ${miscolumnas.filter(e => e.nombre === tarea.estado)[0].color}`
                    }}>
                    <Grid item xs={11}>
                        <Typography variant="body1" style={{ color: '#1e272e' }}>{tarea.nombre}</Typography>
                        <Typography variant="caption" style={{ color: 'dimgrey' }}>{tarea.descripcion}</Typography>
                    </Grid>
                    <Grid item xs={1} container flexDirection='column' alignItems='center' >
                        <Grid>
                            <Typography variant="caption" style={{ color: '#1e272e' }}>{tarea.estado}</Typography>
                        </Grid>
                        <Grid>
                            <Tooltip title="Editar tarea">
                                <IconButton onClick={() => handleEdit(tarea.idtarea)}>
                                    <Icon style={{ color: '#1e272e' }}>edit</Icon>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Borrar tarea">
                                <IconButton onClick={() => handleAbrirModalDeleteTarea(tarea.idtarea)}>
                                    <Icon style={{ color: '#1e272e' }}>delete</Icon>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
            )
            }
            <ConfirmarBorrar callbackConfirmar={() => confirmarBorrarTareaClicked()} />
        </Box>
    );
};

export default ListadoTareas;