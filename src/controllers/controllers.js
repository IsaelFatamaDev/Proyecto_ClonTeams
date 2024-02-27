import conexion from "../conexion.js";

export function obtenerDatos(callback) {
     conexion.query("SELECT * FROM datos_ejemplo", callback);
}
