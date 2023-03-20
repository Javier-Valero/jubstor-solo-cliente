import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.user
            ? <Outlet /> // Outlet representa a todos los componentes hijos/routes que están dentro de RequireAuth
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;