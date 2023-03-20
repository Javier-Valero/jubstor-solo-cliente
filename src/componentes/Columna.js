import PropTypes from "prop-types";
import { Droppable } from "react-beautiful-dnd";
import TarjetaTarea from "./TarjetaTarea";
import { Box, Typography } from "@mui/material";

const Columna = ({ droppableId, columna }) => {
    return (
        <Droppable droppableId={droppableId} key={droppableId}>
            {(provided, snapshot) => {
                return (
                    <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                            background: snapshot.isDraggingOver ? "#98817b" : columna.color,
                            padding: 4,
                            width: 250,
                            minHeight: 500,
                            border: "2px solid #ccc",
                            borderRadius: "20px"
                        }}
                    >
                        <Typography component='h1' variant='h5' align='center' style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px", backgroundColor: '#f4f0ec', marginBottom: '.7rem' }}>
                            {columna.nombre}
                        </Typography>
                        {columna?.tareas?.map((item, index) => {
                            return <TarjetaTarea key={item.idtarea} item={item} index={index} />;
                        })}
                        {provided.placeholder}
                    </Box>
                );
            }}
        </Droppable>
    );
};
Columna.propTypes = {
    columna: PropTypes.object,
    droppableId: PropTypes.string
};

export default Columna;