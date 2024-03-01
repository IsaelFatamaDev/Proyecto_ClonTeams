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
          const query = `SELECT proyectos.*, categorias.nombre_categoria AS nombre_categoria, usuarios.nombre AS nombre_usuario 
                         FROM proyectos 
                         JOIN categorias ON proyectos.id_categoria = categorias.id_categoria 
                         JOIN usuarios ON proyectos.id_usuario = usuarios.id_usuario 
                         WHERE proyectos.id_categoria = ?`;
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
          conexion.query(query, [idCategoria], (error, resultados) => {
               if (error) {
                    reject(error);
               } else {
                    if (resultados.length > 0) {
                         resolve(resultados[0].nombre_categoria);
                    } else {
                         reject(new Error('No se encontró la categoría con el ID proporcionado'));
                    }
               }
          });
     });
}


export function obtenerUsuariosConProyectos() {
     return new Promise((resolve, reject) => {
          const query = `
          SELECT 
               u.id_usuario,
               u.nombre,
               u.apellido,
               u.email,
               u.fecha_registro,
               u.perfil_Github,
               COUNT(p.id_proyecto) AS cantidad_proyectos
          FROM 
               usuarios u
          LEFT JOIN 
               proyectos p ON u.id_usuario = p.id_usuario
          GROUP BY 
               u.id_usuario, u.nombre, u.apellido, u.email, u.fecha_registro
          `;
          conexion.query(query, (error, resultados) => {
               if (error) {
                    reject(error);
               } else {
                    resolve(resultados);
               }
          });
     });
}
export async function eliminarUsuario(idUsuario) {
     try {
          conexion.query("DELETE FROM usuarios WHERE id_usuario = ?", [idUsuario]);
          return "Usuario eliminado correctamente";
     } catch (error) {
          console.error("Error al eliminar usuario:", error);
          throw new Error("Error al eliminar usuario");
     }
}

export function obtenerCantidadUsuarios() {
     return new Promise((resolve, reject) => {
          const query = `SELECT COUNT(*) AS cantidad_usuarios FROM usuarios`;
          conexion.query(query, (error, resultado) => {
               if (error) {
                    reject(error);
               } else {
                    resolve(resultado[0].cantidad_usuarios);
               }
          });
     });
}

export function obtenerCantidadProyectos() {
     return new Promise((resolve, reject) => {
          const query = `SELECT COUNT(*) AS cantidad_proyectos FROM proyectos`;
          conexion.query(query, (error, resultado) => {
               if (error) {
                    reject(error);
               } else {
                    resolve(resultado[0].cantidad_proyectos);
               }
          });
     });
}
export function obtenerCategoriasConCantidadProyectos() {
     return new Promise((resolve, reject) => {
          const query = `
            SELECT
                categorias.nombre_categoria AS nombre_categoria,
                COUNT(proyectos.id_proyecto) AS cantidad_proyectos
            FROM
                categorias
                LEFT JOIN proyectos ON categorias.id_categoria = proyectos.id_categoria
            GROUP BY
                categorias.id_categoria
               
        `;

          conexion.query(query, (error, resultados) => {
               if (error) {
                    reject(error);
               } else {
                    resolve(resultados);
                    console.log("Consulta ejecutada:", resultados);
               }
          });

     });
}
export function obtenerDetallesProyecto(idProyecto) {
     return new Promise((resolve, reject) => {
          const query = `
                SELECT proyectos.*, usuarios.nombre AS nombre_usuario, usuarios.email AS email_usuario
FROM proyectos
JOIN usuarios ON proyectos.id_usuario = usuarios.id_usuario
WHERE proyectos.id_proyecto = ?`;
          conexion.query(query, [idProyecto], (error, resultado) => {
               if (error) {
                    reject(error);
               } else {
                    resolve(resultado[0]);
               }
          });
     });
}


export function registrarNuevoAdministrador(nombre_admin, apellido_admin, email_admin, password_admin) {
     return new Promise((resolve, reject) => {
          const query = "INSERT INTO admins (nombre_admin, apellido_admin, email_admin, password_admin, fecha_admin) VALUES (?, ?, ?, ?,NOW())";
          conexion.query(query, [nombre_admin, apellido_admin, email_admin, password_admin], (error, resultados) => {
               if (error) {
                    reject(error);
               } else {
                    resolve();
               }
          });
     });
}
export function obtenerProyectosPorUsuario(idUsuario) {
     return new Promise((resolve, reject) => {
          const query = `SELECT * FROM proyectos WHERE id_usuario = ?`;
          conexion.query(query, [idUsuario], (error, resultados) => {
               if (error) {
                    reject(error);
               } else {
                    resolve(resultados);
               }
          });
     });
}
export function obtenerCantidadProyectosPorUsuario(nombreUsuario) {
     return new Promise((resolve, reject) => {
          const query = `
          SELECT COUNT(*) AS cantidad_proyectos
          FROM proyectos
          WHERE id_usuario = (
               SELECT id_usuario 
               FROM usuarios 
               WHERE nombre = ?
          )`;
          conexion.query(query, [nombreUsuario], (error, resultado) => {
               if (error) {
                    reject(error);
               } else {
                    resolve(resultado[0].cantidad_proyectos);
               }
          });
     });
}


export function obtenerProyectosPorNombre(nombreUsuario) {
     return new Promise((resolve, reject) => {
          const query = `
               SELECT proyectos.*, categorias.nombre_categoria AS nombre_categoria
               FROM proyectos
               JOIN categorias ON proyectos.id_categoria = categorias.id_categoria
               JOIN usuarios ON proyectos.id_usuario = usuarios.id_usuario
               WHERE usuarios.nombre = ?;
          `;
          conexion.query(query, [nombreUsuario], (error, resultados) => {
               if (error) {
                    reject(error);
               } else {
                    resolve(resultados);
               }
          });
     });
}
export async function eliminarProyecto(idProyecto) {
     try {
          await conexion.query("DELETE FROM proyectos WHERE id_proyecto = ?", [idProyecto]);
          console.log(`Proyecto con ID ${idProyecto} eliminado correctamente.`);
     } catch (error) {
          console.error("Error al eliminar el proyecto:", error);
          throw new Error("Error al eliminar el proyecto");
     }
}
