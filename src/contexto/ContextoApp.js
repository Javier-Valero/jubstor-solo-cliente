
import { createContext, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from '../hooks/useAuth';
/// CONTEXTO GENERAL PARA COMPARTIR VARIABLES Y FUNCIONES COMUNES ///
const ContextoApp = createContext({});

export const AppProvider = ({ children }) => {
    const server_url = process.env.REACT_APP_SERVERURL
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [nombrePantalla, setNombrePantalla] = useState('');
    const [idtareaBorrar, setIdtareaBorrar] = useState(null);
    const [borrarTarea, setBorrarTarea] = useState(false);
    const [borrarUsuario, setBorrarUsuario] = useState(false);
    const bearer = 'Bearer ' + auth?.accessToken
    const user = auth?.user

    const throwErrorSesion = () => {
        // eslint-disable-next-line no-throw-literal
        throw {
            name: 'ErrorSesion',
            message: 'La sesión ha expirado'
        };
    }
    const compruebaErrorSesion = (response) => {
        // Si tenemos un fallo en los permisos(sesión caducada) se lanza una excepción 'ErrorSesion'
        if (response.status === 401 || response.status === 403) {
            throwErrorSesion();
        }
    }

    const excepcionSesion = (error) => {
        /* Comprobamos si la excepción es por fallo en la sesión, si es así limpiamos el localStorage y 
        redirigimos a login pasando el error y la ubicación actual para poder regresar a la misma al hacer el login */
        if (error.name === 'ErrorSesion') {
            window.localStorage.clear();
            navigate("/login", { state: { from: location, replace: true, error: error.message } });
        }
    }

    const miscolumnas = [
        { "nombre": "Por hacer", "color": '#dbd7d2', "tareas": [] },
        { "nombre": "Iniciada", "color": '#c9c0bb', "tareas": [] },
        { "nombre": "En espera", "color": '#808080', "tareas": [] },
        { "nombre": "Completada", "color": '#353839', "tareas": [] },
    ]

    // Control para el modal de borrar tarea
    const handleAbrirModalDeleteTarea = (idtarea) => {
        setIdtareaBorrar(idtarea);
        setBorrarTarea(true);
    };

    const handleCerrarModalDeleteTarea = () => {
        setIdtareaBorrar(null)
        setBorrarTarea(false)
    };

    // Control para el modal de borrar cuenta de usuario
    const handleAbrirModalDeleteUser = () => {
        setBorrarUsuario(true);
    };

    const handleCerrarModalDeleteUser = () => {
        setBorrarUsuario(false)
    };

    // Control para editar tarea
    const handleEdit = async (idtarea) => {
        navigate(`/tareas/${idtarea}/editar`, { state: { from: location, replace: true } });
    };

    return (
        <ContextoApp.Provider value={{
            server_url,
            nombrePantalla, setNombrePantalla,
            compruebaErrorSesion, excepcionSesion,
            bearer,
            auth, setAuth,
            user,
            navigate, location,
            miscolumnas,
            handleAbrirModalDeleteTarea, handleCerrarModalDeleteTarea,
            handleAbrirModalDeleteUser, handleCerrarModalDeleteUser,
            idtareaBorrar, setIdtareaBorrar,
            borrarTarea, setBorrarTarea, borrarUsuario, setBorrarUsuario,
            handleEdit
        }}>
            {children}
        </ContextoApp.Provider>
    )
}

export default ContextoApp;