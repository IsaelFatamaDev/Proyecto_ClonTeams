import express from "express";
import * as controllersJs from "../controllers/controllers.js";
import conexion from "../conexion.js";

const server = express.Router();


server.get('/loginUser', (req, res) => {
     res.render('login', { failedLogin: true });
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
server.post("/registro", (req, res) => {
     const { nombre, email, password, perfil_Github } = req.body;
     const fechaRegistro = new Date().toISOString().slice(0, 10);

     const usuario = {
          nombre,
          email,
          password,
          perfil_Github,
          fecha_registro: fechaRegistro
     };

     const sql = "INSERT INTO USUARIOS SET ?";
     conexion.query(sql, usuario, (err, result) => {
          if (err) {
               console.error("Error al registrar usuario:", err);
               res.status(500).send("Error al registrar usuario");
          } else {
               console.log("Usuario registrado correctamente");
               res.redirect('/login'); // Redireccionar solo después de la inserción exitosa
          }
     });
});
server.post("/login", (req, res) => {
     const { nombreUsuario, password } = req.body;

     // Verificar si se proporcionaron tanto el nombre de usuario como la contraseña
     if (nombreUsuario && password) {
          // Consultar la base de datos para verificar las credenciales
          const sql = "SELECT * FROM USUARIOS WHERE nombre = ? AND password = ?";
          conexion.query(sql, [nombreUsuario, password], (err, results) => {
               if (err) {
                    console.error("Error al consultar la base de datos:", err);
                    res.status(500).send("Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
               } else {
                    // Verificar si se encontraron resultados en la consulta
                    if (results.length > 0) {
                         // Si las credenciales son válidas, redirigir al usuario a la página de inicio
                         res.redirect("/proyectos");
                    } else {
                         res.render("login", { failedLogin: true });
                    }
               }
          });
     } else {
          // Si no se proporcionaron el nombre de usuario o la contraseña, renderizar el formulario de inicio de sesión nuevamente con un mensaje de error
          res.render("login", { error: "Por favor, ingresa tanto el nombre de usuario como la contraseña." });
     }
});


server.get("/logout", (req, res) => {
     // Destruir la sesión del usuario
     req.session.destroy((err) => {
          if (err) {
               console.error("Error al cerrar sesión:", err);
               res.status(500).send("Error al cerrar sesión. Por favor, inténtalo de nuevo.");
          } else {
               // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
               res.redirect("/login");
          }
     });
});


export default server;

