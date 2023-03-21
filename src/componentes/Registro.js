import React, { useState } from "react";
import useContextoApp from '../hooks/useContextoApp';
import { Link as RouteLink } from "react-router-dom";
import { Box, Button, CircularProgress, Grid, Icon, IconButton, InputAdornment, TextField, Typography } from "@mui/material";

const Registro = () => {
    // Declaramos o importamos las variables y funciones necesarias 
    const { navigate, setAuth, setNombrePantalla, server_url } = useContextoApp();
    setNombrePantalla('Registro')
    const [usuario, setUsuario] = useState({
        nombre: "",
        apellidos: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [comprobando, setComprobando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const handleClickMostrarPassword = () => setMostrarPassword((mostrar) => !mostrar)

    const handleChange = (e) => {
        setError(null)
        setUsuario({ ...usuario, [e.target.name]: e.target.value.trim() })
    };

    const eliminarEspacios = (obj) => {
        for (let campo in obj) {
            obj[campo] = obj[campo].trim()
        }
        return obj
    };

    const signup = async (event) => {
        event.preventDefault();
        setComprobando(true);
        const mis_datos = eliminarEspacios(usuario)
        // Hacemos la solicitud al servidor
        try {
            const response = await fetch(`${server_url}/registro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'same-origin',
                body: JSON.stringify(mis_datos),
            });
            const result = await response.json();
            setComprobando(false);
            if (result.error === true) {
                setError(result.message)
            } else {
                const accessToken = result.token;
                const user = result.usuario
                setAuth({ user, accessToken });
                setError(null)
                navigate("/");
            }
        } catch (error) {
            console.error(error);
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                            value={usuario.apellidos}
                        />
                    </Grid>
                    <Grid item xs={12}>
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
                            onChange={handleChange}
                            value={usuario.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="filled"
                            label="Cotraseña"
                            type={mostrarPassword ? 'text' : 'password'}
                            sx={{
                                display: "block",
                                margin: ".5rem 0",
                            }}
                            required
                            fullWidth
                            name="password"
                            autoFocus
                            onChange={handleChange}
                            value={usuario.password}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickMostrarPassword}
                                        edge="end"
                                    >
                                        {mostrarPassword ? <Icon>visibility_off</Icon> : <Icon>visibility</Icon>}
                                    </IconButton>
                                </InputAdornment>,
                            }}
                        />
                    </Grid>
                </Grid>
                {error && <Typography color='red' variant='subtitle2'>{error}</Typography>}
                <Box my={2} display='flex' justifyContent='center'>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        onClick={signup}
                    >
                        {comprobando ? (
                            <CircularProgress color="inherit" size={25} />
                        ) : (
                            "Confirmar"
                        )}
                    </Button>
                </Box>
                <Grid container justify='flex-end'>
                    <Grid item>
                        <RouteLink to='/login'>
                            ¿Ya tienes una cuenta? Login
                        </RouteLink>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default Registro;