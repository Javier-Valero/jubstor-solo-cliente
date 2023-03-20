import useAuth from './useAuth';

const useRefrescarToken = () => {
    const { setAuth } = useAuth();
    const refrescar = async (idusuario) => {
        const response = await fetch("http://localhost:4000/usuarios/refrescar/" + idusuario, {
            method: "GET",
            credentials: 'same-origin',
        });
        const result = await response.json();
        const accessToken = result.token;
        const user = result.usuario
        setAuth(prev => {
            /*             console.log('prev:', JSON.stringify(prev));
                        console.log('accessToken', user, accessToken); */
            return { ...prev, user, accessToken }
        });
        return accessToken;
    }
    return refrescar;
};

export default useRefrescarToken;