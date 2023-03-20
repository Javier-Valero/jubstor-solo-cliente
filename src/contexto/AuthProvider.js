
import { createContext, useState } from "react";
/// CONTEXTO PARA PODER MANEJAR LOS PERMISOS ///
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;