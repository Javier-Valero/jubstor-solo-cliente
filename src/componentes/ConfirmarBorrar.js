import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import useContextoApp from '../hooks/useContextoApp';

export default function ConfirmarBorrar({ callbackConfirmar }) {
    const { borrarTarea, borrarUsuario, handleCerrarModalDeleteTarea, handleCerrarModalDeleteUser, } = useContextoApp();

    return (
        <Box>
            <Dialog
                open={borrarTarea || borrarUsuario}
                onClose={borrarTarea ? handleCerrarModalDeleteTarea : handleCerrarModalDeleteUser}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`¿Borrar ${borrarTarea ? 'tarea' : 'cuenta'}?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {borrarTarea ? 'Está tarea se eliminará de forma definitiva.' : 'Al borrar la cuenta se perderá toda la información asociada y necesitará volver a registrarse.'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={borrarTarea ? handleCerrarModalDeleteTarea : handleCerrarModalDeleteUser}>Cancelar</Button>
                    <Button onClick={callbackConfirmar} autoFocus>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}