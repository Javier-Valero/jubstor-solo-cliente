import React, { useState } from "react";
import useContextoApp from '../hooks/useContextoApp';
import { Link as RouteLink } from "react-router-dom";
import { Box, Button, CircularProgress, Checkbox, FormControlLabel, Grid, Icon, IconButton, InputAdornment, TextField, Typography } from "@mui/material";

const Login = () => {
    // Declaramos o importamos las variables y funciones necesarias 
    const { navigate, location, setAuth, setNombrePantalla } = useContextoApp();
    setNombrePantalla('Login')
    const [usuario, setUsuario] = useState({
        email: "",
        password: "",
    });
    const from = location.state?.from?.pathname || "/";
    const sesionExpirada = location.state?.error || null;
    const [error, setError] = useState(sesionExpirada);
    const [recuerdame, setRecuerdame] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const handleClickMostrarPassword = () => setMostrarPassword((mostrar) => !mostrar)

    const handleChange = (e) => {
        setError(null)
        setUsuario({ ...usuario, [e.target.name]: e.target.value.trim() })
    };

    const handleChangeRecuerdame = (e) => {
        setError(null)
        setRecuerdame(!recuerdame)
    };
    const [comprobando, setComprobando] = useState(false);

    const signin = async (event) => {
        event.preventDefault();
        setComprobando(true);
        usuario.recuerdame = recuerdame
        // Hacemos la solicitud al servidor
        try {
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'same-origin',
                body: JSON.stringify(usuario),
            });
            const result = await response.json();
            setComprobando(false);
            if (result.error === true) {
                setError(result.message)
            } else {
                const accessToken = result.token;
                const user = result.usuario
                const miuser = { idusuario: user.idusuario, recuerdame: user.recuerdame }
                // Guardamos datos del usuario en localStorage, para controlar el login persistente
                window.localStorage.setItem("miuser", JSON.stringify(miuser))
                setAuth({ user, accessToken });
                setError(null)
                // Navegamos de vuelta a la página de la que viníamos si la hubiera, guardada en 'from
                navigate(from, { replace: true });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUsuario({
                email: "",
                password: "",
                recuerdame: false
            })
            setRecuerdame(false)
        }
    };

    return (
        <Box mt={2} display='flex' flexDirection='column' alignItems='center'>
            <form style={{ width: "30%", marginTop: 20 }} noValidate>
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
                <TextField
                    variant="filled"
                    label="Contraseña"
                    type={mostrarPassword ? 'text' : 'password'}
                    sx={{
                        display: "block",
                        margin: ".5rem 0",
                    }}
                    required
                    fullWidth
                    name="password"
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
                {error && <Typography color='red' variant='subtitle2'>{error}</Typography>}
                <FormControlLabel
                    control={<Checkbox value={recuerdame} name="recuerdame" onChange={handleChangeRecuerdame} color='primary' />}
                    label='Recuérdame'
                />
                <Box my={2} display='flex' justifyContent='center'>
                    <Button
                        onClick={signin}
                        type='submit'
                        variant='contained'
                        color='primary'
                    >
                        {comprobando ? (
                            <CircularProgress color="inherit" size={25} />
                        ) : (
                            "Entrar"
                        )}
                    </Button>
                </Box>
                <Grid container>
                    <Grid item>
                        <RouteLink to='/registro'>
                            {"¿No tienes una cuenta? Resgístrate"}
                        </RouteLink>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default Login;