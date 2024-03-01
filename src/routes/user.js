import express from "express";
import * as controllersJs from "../controllers/controllers.js";
import conexion from "../conexion.js";
import { obtenerCantidadProyectosPorUsuario } from "../controllers/controllers.js";
const server = express.Router();


server.get('/loginUser', (req, res) => {
     res.render('loginUser', { failedLogin: true });
});


server.get('/proyectos', (req, res) => {
     controllersJs.obtenerDatosCategoria()
          .then(categorias => {
               res.render("categoria/panel", {
                    categorias: categorias
               });
          })
          .catch(error => {
               console.error("Error al obtener categorías:", error);
               res.status(500).send("Error al obtener categorías");
          });
});
server.get('/proyectos/:categoria', (req, res) => {
     const categoria = req.params.categoria;
     controllersJs.obtenerProyectosPorCategoria(categoria)
          .then(proyectos => {
               controllersJs.obtenerNombreCategoria(categoria)
                    .then(nombre_Categoria => {
                         res.render("categoria/javav2", {
                              title: `Proyectos - ${nombre_Categoria}`,
                              categoria: {
                                   id_categoria: categoria,
                                   nombre_categoria: nombre_Categoria
                              },
                              proyectos: proyectos
                         });
                    })
                    .catch(error => {
                         console.error("Error al obtener nombre de categoría:", error);
                         res.status(500).send("Error al obtener nombre de categoría");
                    });
          })
          .catch(error => {
               console.error("Error al obtener proyectos por categoría:", error);
               res.status(500).send("Error al obtener proyectos");
          });
});
server.get('/proyectos/:categoria/unirse', async (req, res) => {
     const projectId = req.query.id;
     try {
          const proyecto = await controllersJs.obtenerDetallesProyecto(projectId);
          const categoria = await controllersJs.obtenerNombreCategoria(proyecto.id_categoria);
          res.render("proyectos/proyectoDetalles.ejs", { proyecto: proyecto, categoria: categoria });
     } catch (error) {
          console.error('Error al obtener detalles del proyecto:', error);
          res.status(500).send('Error al obtener detalles del proyecto');
     }
});
server.get('/proyectos/categoria/enviar-correo', async (req, res) => {
     const idProyecto = req.query.id;
     try {
          const proyecto = await controllersJs.obtenerDetallesProyecto(idProyecto);
          res.render("users/formulario-correo", { emailUsuario: proyecto.email_usuario });
     } catch (error) {
          console.error('Error al obtener detalles del proyecto:', error);
          res.status(500).send('Error al obtener detalles del proyecto');
     }
});


server.post('/registerUser', (req, res) => {
     try {
          const { nombre, apellido, email, password, perfil_GitHub } = req.body;
          const query = 'INSERT INTO USUARIOS (nombre, apellido,email, password, perfil_GitHub, fecha_registro) VALUES (?,?,?,?,?, now())';
          const values = [nombre, apellido, email, password, perfil_GitHub]
          conexion.query(query, values, (error, resultado) => {
               if (error) {
                    console.error("Error al registrar usuario:", error);
                    res.redirect('/loginUser')
               } else {
                    console.log("Usuario registrado con éxito");
                    res.redirect('/loginUser');
               }
          });
     } catch {
          console.error("Error inesperado:", error);
          res.status(500).json({ error: "Error inesperado del servidor" });
     }
})
server.post("/logUser", (req, res) => {
     try {
          const { nombre, password } = req.body;
          const query = 'SELECT * FROM USUARIOS WHERE nombre = ? AND password = ?';
          const values = [nombre, password];
          conexion.query(query, values, (error, results) => {
               if (error) {
                    console.error("Error al intentar iniciar sesión:", error);
                    res.redirect('/loginUser');
               } else {
                    if (results.length > 0) {
                         console.log(results);
                         const info = {
                              nombres: results[0].nombre,
                              correo: results[0].email
                         }
                         req.session.info = info;
                         res.redirect(`/userPanel`);
                    } else {
                         res.redirect('/loginUser');
                    }
               }
          });
     } catch (error) {
          console.error("Error inesperado:", error);
          res.status(500).json({ error: "Error inesperado del servidor" });
     }
});

server.post("/logout", (req, res) => {
     req.session.destroy((err) => {
          if (err) {
               console.error("Error al cerrar sesión:", err);
          }
          res.redirect('/login');
     });
});

server.get("/userPanel", async (req, res) => {
     const userData = req.session.info;
     if (!userData) { return res.redirect('/loginUser') }

     try {
          const nombreUsuario = userData.nombres;
          const cantidadProyectos = await obtenerCantidadProyectosPorUsuario(nombreUsuario);
          res.render('vistas/userPanel', { userData, nombreUsuario, cantidadProyectos });
          console.log(nombreUsuario);
     } catch (error) {
          console.error("Error al obtener la cantidad de proyectos del usuario:", error);
          res.redirect('/error');
     }
});

// Corregir la ruta de gestión de proyectos por nombre de usuario
server.get('/gestionProyectos/:nombre', async (req, res) => {
     const userData = req.session.info;
     if (!userData) { return res.redirect('/loginUser') }

     try {
          const nombreUsuario = req.params.nombre;
          const proyectosUsuario = await controllersJs.obtenerProyectosPorNombre(nombreUsuario);

          res.render('vistas/proyectosUser', {
               nombreUsuario,
               proyectosUsuario,
               userData
          });
          console.log(proyectosUsuario)
     } catch (error) {
          console.error("Error al obtener los proyectos del usuario:", error);
          res.redirect('/error');
     }
});
server.post("/eliminarProyecto", async (req, res) => {
     const { id_proyecto } = req.body;
     try {
          // Llama a la función de tu controlador para eliminar el proyecto por su ID
          await controllersJs.eliminarProyecto(id_proyecto);
          console.log(`Proyecto con ID ${id_proyecto} eliminado correctamente.`);
          // Redirige al usuario a la página de proyectos o a donde prefieras
          res.redirect("/userPanel");
     } catch (error) {
          console.error("Error al eliminar el proyecto:", error);
          res.status(500).send("Error al eliminar el proyecto");
     }
});

server.get('/agregarProyecto', (req, res) => {
     // Consulta SQL para obtener todas las categorías
     const query = 'SELECT * FROM CATEGORIAS';

     // Ejecutar la consulta para obtener las categorías
     conexion.query(query, (error, categorias) => {
          if (error) {
               console.error('Error al obtener las categorías: ' + error.stack);
               res.status(500).send('Error al obtener las categorías');
               return;
          }

          // Renderizar la vista del formulario y pasar las categorías como datos
          res.render('vistas/form', { categorias: categorias });
     });
});
/*
server.post('/agregarProyecto', (req, res) => {
     // Obtener el nombre del usuario autenticado
     const userData = req.session.info;
     console.log(userData)
     if (!userData || !userData.nombres) {
          console.error('No se pudo obtener el nombre del usuario');
          res.status(401).send('Nombre de usuario no definido');
          return;
     }
     const nombreUsuario = userData.nombre;

     // Consultar la base de datos para obtener el ID del usuario usando su nombre
     const query = 'SELECT id_usuario FROM USUARIOS WHERE nombre = ?';
     conexion.query(query, [nombreUsuario], (error, resultados) => {
          if (error) {
               console.error('Error al buscar el ID del usuario: ' + error.stack);
               res.status(500).send('Error al buscar el ID del usuario');
               return;
          }

          // Verificar si se encontró el ID del usuario
          if (resultados.length === 0) {
               // Si no se encontró el ID del usuario, enviar un error
               console.error('No se encontró el ID del usuario');
               res.status(404).send('No se encontró el ID del usuario');
               return;
          }

          // Obtener el ID del usuario
          const userId = resultados[0].id_usuario;

          // Obtener los datos del formulario
          const { nombre, descripcion, fecha_inicio, categoria, enlaces } = req.body;

          // Consulta SQL para insertar un nuevo proyecto en la base de datos
          const queryInsert = 'INSERT INTO PROYECTOS (nombre_proyecto, descripcion, fecha_inicio, id_usuario, id_categoria, enlaces) VALUES (?, ?, ?, ?, ?, ?)';

          // Ejecutar la consulta para insertar el nuevo proyecto
          conexion.query(queryInsert, [nombre, descripcion, fecha_inicio, userId, categoria, enlaces], (errorInsert, resultadoInsert) => {
               if (errorInsert) {
                    console.error('Error al agregar el proyecto: ' + errorInsert.stack);
                    res.status(500).send('Error al agregar el proyecto');
                    return;
               }

               console.log('Proyecto agregado correctamente');
               // Redirigir al usuario a una página de éxito o a donde desees
               res.redirect('/proyectosUser');
          });
     });
});

*/
// Ruta para procesar el formulario de agregar proyecto
server.post('/agregarProyecto', (req, res) => {
     // Obtener los datos del formulario
     const { nombre, descripcion, fecha_inicio, categoria, enlaces } = req.body;

     // Consulta SQL para insertar un nuevo proyecto en la base de datos
     const query = 'INSERT INTO PROYECTOS (nombre_proyecto, descripcion, fecha_inicio, id_categoria, enlaces, id_usuario) VALUES (?, ?, ?, ?, ?, 7)';

     // Ejecutar la consulta para insertar el nuevo proyecto
     conexion.query(query, [nombre, descripcion, fecha_inicio, categoria, enlaces], (error, resultado) => {
          if (error) {
               console.error('Error al agregar el proyecto: ' + error.stack);
               res.status(500).send('Error al agregar el proyecto');
               return;
          }

          console.log('Proyecto agregado correctamente');
          // Redirigir al usuario a una página de éxito o a donde desees
          res.redirect('/gestionProyectos');
     });
});


export default server;

