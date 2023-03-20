import React from "react";
import { AppBar, Box, Container, Grid, IconButton, Icon, Toolbar, Tooltip, Typography } from "@mui/material";
import useContextoApp from '../hooks/useContextoApp';


export default function Menu() {
    // Declaramos o importamos las variables y funciones necesarias 
    const { auth, navigate, nombrePantalla, location, setAuth, user } = useContextoApp();
    const logout = () => {
        setAuth(null);
        window.localStorage.clear();
        navigate("/login")
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="transparent">
                <Container>
                    <Toolbar>
                        <Grid container alignItems='center' justifyContent='space-between'>
                            <Grid item xs={4}>
                                <Box sx={{ width: '20%' }}>
                                    <Tooltip title="Inicio">
                                        <IconButton onClick={() => navigate('/')}>
                                            <img src="./logo_jubstor.png" alt="Jubstor" style={{ width: '84%' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                            <Grid item xs={4} >
                                <Typography align='center' variant="h6" component="div" sx={{ flexGrow: 1 }}>{nombrePantalla.toUpperCase()}
                                </Typography>
                            </Grid>
                            {auth?.accessToken
                                ? <Grid item xs={4} >
                                    <Box display='flex' justifyContent='flex-end' >
                                        <Tooltip title="Vista listado">
                                            <IconButton onClick={() => navigate(`/tareas`)}>
                                                <Icon>list</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Vista kanban">
                                            <IconButton onClick={() => navigate(`/kanban`)}>
                                                <Icon>view_week</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Crear tarea">
                                            <IconButton onClick={() => navigate(`/tareas/nueva`, { state: { from: location, replace: true } })}>
                                                <Icon>add</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={`Editar perfil de ${user.nombre} ${user.apellidos}`}>
                                            <IconButton onClick={() => navigate(`/usuario`)}>
                                                <Icon>person</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Salir">
                                            <IconButton onClick={logout}>
                                                <Icon>logout</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Grid>
                                : <Grid item xs={4} />
                            }
                        </Grid>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box >
    );
}
