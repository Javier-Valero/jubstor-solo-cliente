import { Link } from "react-router-dom"

const RutaDesconocida = () => {
    return (
        <article style={{ padding: "100px" }}>
            <h1>¡Oh, vaya!</h1>
            <p>Página no encontrada</p>
            <div className="flexGrow">
                <Link to="/">Ir a la página de inicio</Link>
            </div>
        </article>
    )
}

export default RutaDesconocida