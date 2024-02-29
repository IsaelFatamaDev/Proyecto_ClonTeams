import conexion from "../conexion.js";

export function obtenerDatos(callback) {
     conexion.query("SELECT * FROM datos_ejemplo", callback);
}

export function obtenerDatosCategoria() {
     return new Promise((resolve, reject) => {
          conexion.query("SELECT * FROM categorias", (error, resultados) => {
               if (error) {
                    reject(error);
               } else {
                    resolve(resultados);
               }
          });
     });
}
export function obtenerProyectosPorCategoria(categoria) {
     return new Promise((resolve, reject) => {
          const query = `SELECT proyectos.*, categorias.nombre_categoria AS nombre_categoria FROM proyectos JOIN categorias ON proyectos.id_categoria = categorias.id_categoria WHERE proyectos.id_categoria = ?`;
          conexion.query(query, [categoria], (error, resultados) => {
               if (error) {
                    reject(error);
               } else {
                    resolve(resultados);
               }
          });
     });
}
export function obtenerNombreCategoria(idCategoria) {
     return new Promise((resolve, reject) => {
          const query = `SELECT nombre_categoria FROM categorias WHERE id_categoria = ?`;
          conexion.query(query, [idCategoria], (error, resultado) => {
               if (error) {
                    reject(error);
               } else {
                    resolve(resultado[0].nombre_categoria);
               }
          });
     });
}
