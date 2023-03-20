import React, { useState } from "react";
import useContextoApp from '../hooks/useContextoApp';
import ConfirmarBorrar from './ConfirmarBorrar';
import { Box, Button, CircularProgress, FormControl, Grid, Icon, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

const Usuario = () => {
    const { bearer, setNombrePantalla, compruebaErrorSesion, excepcionSesion, handleAbrirModalDeleteUser, handleCerrarModalDeleteUser, navigate, user, setAuth } = useContextoApp();
    setNombrePantalla('Editar perfil usuario')
    const [usuario, setUsuario] = useState(user);
    const [password, setPassword] = useState({
        actual: "",
        nueva: ""
    });
    const [errorUsuario, setErrorUsuario] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    const [comprobandoUsuario, setComprobandoUsuario] = useState(false);
    const [comprobandoPassword, setComprobandoPassword] = useState(false);
    const [mostrarPasswordNueva, setMostrarPasswordNueva] = useState(false);
    const [mostrarPasswordActual, setMostrarPasswordActual] = useState(false);

    const handleClickMostrarPasswordNueva = () => setMostrarPasswordNueva((mostrar) => !mostrar)
    const handleClickMostrarPasswordActual = () => setMostrarPasswordActual((mostrar) => !mostrar)

    const hayCambios = JSON.stringify(user) === JSON.stringify(usuario);

    const handleChangeUsuario = (e) => {
        setErrorUsuario(null)
        setUsuario({ ...usuario, [e.target.name]: e.target.value })
    };
    const handleChangePassword = (e) => {
        setErrorPassword(null)
        setPassword({ ...password, [e.target.name]: e.target.value })
    };

    const eliminarEspacios = (obj) => {
        Object.keys(obj).forEach(async (k) => {
            if (typeof obj[k] === "string") {
                obj[k] = obj[k].trim();
            }
        });
        return obj
    };

    const sonDiferentes = (password) => {
        return password.actual !== password.nueva
    };

    const actualizarUsuario = async (event) => {
        event.preventDefault();
        setComprobandoUsuario(true);
        // Para no tener espacios al principio o al final del valor si es un string
        const mis_datos = eliminarEspacios(usuario)
        // Hacemos la solicitud al servidor
        try {
            const response = await fetch(
                "http://localhost:4000/usuarios/" + user.idusuario,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", 'Authorization': bearer },
                    body: JSON.stringify(mis_datos),
                    credentials: 'same-origin',
                }
            );
            const result = await response.json();
            setComprobandoUsuario(false);
            compruebaErrorSesion(response)
            if (result.error === true) {
                setErrorUsuario(result.message)
            } else {
                const accessToken = result.token;
                const user = result.usuario
                setAuth({ user, accessToken });
                setErrorUsuario(null)
                navigate("/");
            }
        } catch (errorUsuario) {
            console.error(errorUsuario);
            excepcionSesion(errorUsuario)
        }
    };

    const actualizarPassword = async (event) => {
        event.preventDefault();
        setComprobandoPassword(true);
        const mis_datos = eliminarEspacios(password)
        // Hacemos la solicitud al servidor
        if (sonDiferentes(password)) {
            try {
                const response = await fetch(
                    "http://localhost:4000/usuarios/password/" + user.idusuario,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", 'Authorization': bearer },
                        body: JSON.stringify(mis_datos),
                        credentials: 'same-origin',
                    }
                );
                const result = await response.json();
                setComprobandoPassword(false);
                compruebaErrorSesion(response)
                if (result.error === true) {
                    setErrorPassword(result.message)
                } else {
                    setErrorPassword(null)
                    navigate("/");
                }
            } catch (errorPassword) {
                console.error(errorPassword);
                excepcionSesion(errorUsuario)
            }
        } else {
            setErrorPassword("Las contraseñas son iguales");
            setComprobandoPassword(false);
        }
    };

    const confirmarBorrarUsuarioClicked = async () => {
        // Hacemos la solicitud al servidor
        console.log('llego')
        try {
            const response = await fetch(`http://localhost:4000/usuarios/${user.idusuario}`, {
                method: "DELETE",
                headers: { 'Authorization': bearer },
                credentials: 'same-origin',
            });
            await response.json();
            compruebaErrorSesion(response)
            navigate('/login')
        } catch (error) {
            console.error(error);
            excepcionSesion(error)
        } finally {
            handleCerrarModalDeleteUser()
        }
    };


    return (
        <Box mt={2} display='flex' flexDirection='column' alignItems='center'>
            <form style={{ width: "50%", marginTop: 20 }} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="filled"
                            label="Nombre"
                            sx={{
                                display: "block",
                                margin: ".5rem 0",
                            }}
                            required
                            fullWidth
                            name="nombre"
                            autoFocus
                            onChange={handleChangeUsuario}
                            value={usuario.nombre}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="filled"
                            label="Apellidos"
                            sx={{
                                display: "block",
                                margin: ".5rem 0",
                            }}
                            required
                            fullWidth
                            name="apellidos"
                            autoFocus
                            onChange={handleChangeUsuario}
                            value={usuario.apellidos}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="filled"
                            label="Email"
                            sx={{
                                display: "block",
                                margin: ".5rem 0",
                            }}
                            required
                            fullWidth
                            name="email"
                            autoFocus
                            onChange={handleChangeUsuario}
                            value={usuario.email}
                        />
                    </Grid>
                    <Grid container item xs={12} sm={6} alignItems='center'>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Vista por defecto</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={usuario.vista}
                                label="Vista por defecto"
                                onChange={handleChangeUsuario}
                                name="vista"
                            >
                                <MenuItem value={'listado'}>Listado</MenuItem>
                                <MenuItem value={'kanban'}>Kanban</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {errorUsuario && <Typography color='red' variant='subtitle2'>{errorUsuario}</Typography>}
                <Box my={2} display='flex' justifyContent='center'>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        onClick={actualizarUsuario}
                        disabled={hayCambios}
                    >
                        {comprobandoUsuario ? (
                            <CircularProgress color="inherit" size={25} />
                        ) : (
                            "Confirmar"
                        )}
                    </Button>
                </Box>
            </form>
            <form style={{ width: "50%", marginTop: 20 }} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="filled"
                            label="Contraseña actual"
                            type={mostrarPasswordActual ? 'text' : 'password'}
                            sx={{
                                display: "block",
                                margin: ".5rem 0",
                            }}
                            required
                            fullWidth
                            name="actual"
                            autoFocus
                            onChange={handleChangePassword}
                            value={password.actual}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickMostrarPasswordActual}
                                        edge="end"
                                    >
                                        {mostrarPasswordActual ? <Icon>visibility_off</Icon> : <Icon>visibility</Icon>}
                                    </IconButton>
                                </InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="filled"
                            label="Contraseña nueva"
                            sx={{
                                display: "block",
                                margin: ".5rem 0",
                            }}
                            type={mostrarPasswordNueva ? 'text' : 'password'}
                            required
                            fullWidth
                            name="nueva"
                            autoFocus
                            onChange={handleChangePassword}
                            value={password.nueva}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickMostrarPasswordNueva}
                                        edge="end"
                                    >
                                        {mostrarPasswordNueva ? <Icon>visibility_off</Icon> : <Icon>visibility</Icon>}
                                    </IconButton>
                                </InputAdornment>,
                            }}
                        />
                    </Grid>
                </Grid>
                {errorPassword && <Typography color='red' variant='subtitle2'>{errorPassword}</Typography>}
                <Box my={2} display='flex' justifyContent='center'>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        onClick={actualizarPassword}
                    >
                        {comprobandoPassword ? (
                            <CircularProgress color="inherit" size={25} />
                        ) : (
                            "Confirmar"
                        )}
                    </Button>
                </Box>
            </form>
            <Box my={2} display='flex' justifyContent='center'>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={() => handleAbrirModalDeleteUser()}
                >Borrar cuenta</Button>
            </Box>
            <ConfirmarBorrar callbackConfirmar={() => confirmarBorrarUsuarioClicked()} />
        </Box>
    );
};

export default Usuario;
