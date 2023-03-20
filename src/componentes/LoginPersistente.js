
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefrescarToken from '../hooks/useRefrescarToken';
import useAuth from '../hooks/useAuth';

const LoginPersistente = () => {
    const [cargando, setCargando] = useState(true);
    const miuser = JSON.parse(window.localStorage.getItem('miuser'))
    const refrescar = useRefrescarToken();
    const { auth } = useAuth();
    useEffect(() => {
        let isMounted = true;

        const verificaRefrecarToken = async () => {
            try {
                await refrescar(miuser?.idusuario);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setCargando(false);
            }
        }

        // Evita llamadas no deseadas a verificaRefrecarToken
        !auth?.accessToken && miuser?.recuerdame ? verificaRefrecarToken() : setCargando(false);

        return () => isMounted = false;
    }, [])

    /*     useEffect(() => {
            console.log(`cargando: ${cargando}`)
            console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
        }, [cargando]) */

    // Outlet representa a todos los componentes hijos/routes que están dentro de LoginPersistente
    return (
        <>
            {!miuser?.recuerdame
                ? <Outlet />
                : cargando
                    ? <p>Cargando...</p>
                    : <Outlet />
            }
        </>
    )
}

export default LoginPersistente