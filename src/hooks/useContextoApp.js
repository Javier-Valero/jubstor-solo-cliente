import { useContext } from "react";
import ContextoApp from "../contexto/ContextoApp";

const useContextoApp = () => {
    return useContext(ContextoApp);
}

export default useContextoApp;