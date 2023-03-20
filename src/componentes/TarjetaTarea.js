import React from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";
import { Box, Grid, Typography, IconButton, Icon, Tooltip } from "@mui/material";
import useContextoApp from '../hooks/useContextoApp';


const TarjetaTarea = ({ item, index }) => {
    const { handleAbrirModalDeleteTarea, handleEdit } = useContextoApp();
    item["draggableId"] = item.idtarea.toString()

    return (
        <Draggable key={item.idtarea} draggableId={item.draggableId} index={index}>
            {(provided, snapshot) => {
                return (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                            marginBottom: ".7rem",
                            padding: ".7rem",
                            backgroundColor: snapshot.isDragging ? "#dcdcdc  " : "white",
                            borderRadius: '20px',
                            border: '1px solid #dcdcdc',
                            minHeight: "50px",
                            ...provided.draggableProps.style
                        }}
                    >
                        <Grid container flexDirection='column'>
                            <Box>
                                <Typography variant="body1" style={{ color: '#1e272e' }}>{item.nombre}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" style={{ color: 'dimgrey' }}>{item.descripcion}</Typography>
                            </Box>
                            <Grid item container alignItems='flex-end' justifyContent='flex-end'>
                                <Tooltip title="Editar tarea">
                                    <IconButton onClick={() => handleEdit(item.idtarea)} >
                                        <Icon style={{ color: '#1e272e' }}>edit</Icon>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Borrar tarea">
                                    <IconButton onClick={() => handleAbrirModalDeleteTarea(item.idtarea)}>
                                        <Icon style={{ color: '#1e272e' }}>delete</Icon>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </div>
                );
            }}
        </Draggable>
    );
}
TarjetaTarea.propTypes = {
    index: PropTypes.number,
    item: PropTypes.object
};

export default TarjetaTarea;