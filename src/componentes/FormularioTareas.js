import React, { useEffect, useState } from "react";
import useContextoApp from '../hooks/useContextoApp';
import { useParams } from "react-router-dom";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, CircularProgress } from "@mui/material";

const FormularioTareas = () => {
    // Declaramos o importamos las variables y funciones necesarias 
    const { bearer, compruebaErrorSesion, excepcionSesion, navigate, location, user, setNombrePantalla } = useContextoApp();
    const from = location.state?.from?.pathname || "/";
    const params = useParams();
    const [tarea, setTarea] = useState({
        nombre: "",
        descripcion: "",
        idusuario: user.idusuario,
        estado: 'Por hacer'
    });
    const [cargando, setCargando] = useState(false);
    const [editando, setEditando] = useState(false);
    setNombrePantalla(editando ? "Editar tarea" : "Nueva tarea")


    useEffect(() => {
        // Si recibimos un idtarea por parámetro cargamos la tarea 
        if (params.idtarea) {
            cargaTarea(params.idtarea);
        }
    }, [params.idtarea]);

    const cargaTarea = async (idtarea) => {
        // Hacemos la solicitud al servidor
        try {
            const response = await fetch("http://localhost:4000/tareas/tarea/" + idtarea,
                {
                    method: "GET",
                    headers: { 'Authorization': bearer },
                    credentials: 'same-origin',
                });
            const data = await response.json();

            compruebaErrorSesion(response)
            setTarea({ nombre: data.nombre, descripcion: data.descripcion, idusuario: data.idusuario, estado: data.estado });
            setEditando(true);
        } catch (error) {
            console.error(error);
            excepcionSesion(error)
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setCargando(true);
        // Hacemos la solicitud al servidor
        try {
            if (editando) {
                const response = await fetch(
                    "http://localhost:4000/tareas/tarea/" + params.idtarea,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", 'Authorization': bearer },
                        body: JSON.stringify(tarea),
                        credentials: 'same-origin',
                    }
                );
                await response.json();
                compruebaErrorSesion(response)
            } else {
                const response = await fetch("http://localhost:4000/tareas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", 'Authorization': bearer },
                    body: JSON.stringify(tarea),
                    credentials: 'same-origin',
                });
                await response.json();
                compruebaErrorSesion(response)
            }

            setCargando(false);
            // Navegamos de vuelta a la página de la que viníamos(listado o kanban) guardada en 'from'
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            excepcionSesion(error)
        }
    };

    // Actualiza los campos del formulario
    const handleChange = (e) =>
        setTarea({ ...tarea, [e.target.name]: e.target.value });

    return (
        <>
            <Grid container key={tarea.idtarea}
                style={{
                    marginTop: ".7rem",
                    padding: ".7rem",
                    backgroundColor: "white",
                    borderRadius: '20px',
                    border: `2px solid dimgrey`
                }}>
                <Grid item xs={12}>
                    <TextField
                        variant="filled"
                        label="Escribe el nombre de la tarea"
                        sx={{
                            display: "block",
                            margin: ".5rem 0",
                        }}
                        fullWidth
                        name="nombre"
                        onChange={handleChange}
                        value={tarea.nombre}
                        inputProps={{ style: { color: "#1e272e", backgroundColor: 'white' } }}
                        InputLabelProps={{ style: { color: "#1e272e" } }}
                    />
                    <TextField
                        variant="filled"
                        label="Escribe la descripción de la tarea"
                        sx={{
                            display: "block",
                            margin: ".5rem 0",
                        }}
                        fullWidth
                        name="descripcion"
                        onChange={handleChange}
                        value={tarea.descripcion}
                        inputProps={{ style: { color: "dimgrey", backgroundColor: 'white' } }}
                        InputLabelProps={{ style: { color: "dimgrey" } }}
                    />
                </Grid>
                <Grid item xs={12} container alignItems='center' justifyContent='space-between'  >
                    <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={tarea.estado}
                                label="Estado"
                                onChange={handleChange}
                                name="estado"
                            >
                                <MenuItem value={'Por hacer'}>Por hacer</MenuItem>
                                <MenuItem value={'Iniciada'}>Iniciada</MenuItem>
                                <MenuItem value={'En espera'}>En espera</MenuItem>
                                {editando && <MenuItem value={'Completada'}>Completada</MenuItem>}

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item justify='flex-end'>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={!tarea.nombre || !tarea.descripcion}
                        >
                            {cargando ? (
                                <CircularProgress color="inherit" size={25} />
                            ) : (
                                "Guardar"
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            {/*  <Grid
                container
                alignItems="center"
                direction="column"
                justifyContent="center"
            >
                <Grid item xs={12}>
                    <Card
                        sx={{ mt: 5 }}
                        style={{
                            backgroundColor: "#dcdcdc",
                            padding: "1rem",
                        }}
                    >
                        <Typography variant="h5" textAlign="center" color="#1e272e">
                            {editando ? "Editar tarea" : "Nueva tarea"}
                        </Typography>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <Grid container flexDirection='column' alignItems='center'>
                                    <Grid item>
                                        <TextField
                                            variant="filled"
                                            label="Escribe el nombre de la tarea"
                                            sx={{
                                                display: "block",
                                                margin: ".5rem 0",
                                            }}

                                            name="nombre"
                                            onChange={handleChange}
                                            value={tarea.nombre}
                                            inputProps={{ style: { color: "#1e272e" } }}
                                            InputLabelProps={{ style: { color: "#1e272e" } }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            variant="filled"
                                            label="Escribe la descripción de la tarea"
                                            multiline
                                            rows={4}
                                            sx={{
                                                display: "block",
                                                margin: ".5rem 0",
                                            }}
                                            name="descripcion"
                                            onChange={handleChange}
                                            value={tarea.descripcion}
                                            inputProps={{ style: { color: "dimgrey" } }}
                                            InputLabelProps={{ style: { color: "dimgrey" } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} style={{ width: '100%' }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={'Completada'}
                                                label="Estado"
                                                onChange={handleChange}
                                                name="vista"
                                            >
                                                <MenuItem value={'Por hacer'}>Por hacer</MenuItem>
                                                <MenuItem value={'Iniciadao'}>Iniciada</MenuItem>
                                                <MenuItem value={'En espera'}>En espera</MenuItem>
                                                <MenuItem value={'Completada'}>Completada</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={!tarea.nombre || !tarea.descripcion}
                                        >
                                            {cargando ? (
                                                <CircularProgress color="inherit" size={25} />
                                            ) : (
                                                "Guardar"
                                            )}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid> */}
        </>
    );
};

export default FormularioTareas;