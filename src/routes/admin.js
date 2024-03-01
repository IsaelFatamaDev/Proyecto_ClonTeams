import express from "express";
import * as controllersJs from "../controllers/controllers.js";
import conexion from "../conexion.js";
const router = express.Router();

router.get("/panel", (req, res) => {
     res.render("dashboard/panel", {
          title: "Administracion"
     });
});

router.get('/categorias', (req, res) => {
     controllersJs.obtenerDatosCategoria()
          .then(categorias => {
               res.render("dashboard/categorias", {
                    title: "Categorias",
                    categorias: categorias
               });
          })
          .catch(error => {
               console.error("Error al obtener categorías:", error);
               res.status(500).send("Error al obtener categorías");
          });
});
router.get('/categorias/:categoria', (req, res) => {
     const categoria = req.params.categoria;
     controllersJs.obtenerProyectosPorCategoria(categoria)
          .then(proyectos => {
               controllersJs.obtenerNombreCategoria(categoria)
                    .then(nombreCategoria => {
                         res.render("categoria/java", {
                              title: `Proyectos - ${nombreCategoria}`,
                              categoria: {
                                   id_categoria: categoria,
                                   nombre_categoria: nombreCategoria
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

router.get('/estadisticas', async (req, res) => {
     try {
          const cantidadUsuarios = await controllersJs.obtenerCantidadUsuarios();
          const cantidadProyectos = await controllersJs.obtenerCantidadProyectos();
          const categoriasConCantidadProyectos = await controllersJs.obtenerCategoriasConCantidadProyectos();

          res.render("dashboard/estadisticas", {
               title: "Estadísticas",
               cantidadUsuarios,
               cantidadProyectos,
               categoriasConCantidadProyectos: JSON.stringify(categoriasConCantidadProyectos), // Asegúrate de convertirlo a JSON
          });
     } catch (error) {
          console.error("Error al obtener estadísticas:", error);
          res.status(500).send("Error al obtener estadísticas");
     }
})

router.get('/usuarios', (req, res) => {
     controllersJs.obtenerUsuariosConProyectos()
          .then(usuarios => {
               res.render("dashboard/usuarios", {
                    title: "Usuarios",
                    usuarios: usuarios
               });
          })
          .catch(error => {
               console.error("Error al obtener usuarios:", error);
               res.status(500).send("Error al obtener usuarios");
          });
});

router.get('/eliminar-usuario/:id', (req, res) => {
     const userId = req.params.id;
     controllersJs.eliminarUsuario(userId)
          .then(() => {
               console.log(`Usuario con ID ${userId} eliminado correctamente`);
               res.redirect('/usuarios');
          })
          .catch(error => {
               console.error(`Error al eliminar usuario con ID ${userId}:`, error);
               res.status(500).send(`Error al eliminar usuario con ID ${userId}`);
          });
});

router.get('/registros_bot', (req, res) => {
     res.render("dashboard/registros_bot", {
          title: "Registros Bot"
     })
})

router.get('/loginAdmin', (req, res) => {
     res.render('loginAdmin');
});



router.post("/loginAdmin", (req, res) => {
     const { email_admin, password_admin } = req.body;

     // Verificar si se proporcionaron tanto el nombre de usuario como la contraseña
     if (email_admin && password_admin) {
          // Consultar la base de datos para verificar las credenciales
          const sql = "SELECT * FROM Admins WHERE email_admin = ? AND password_admin = ?";
          conexion.query(sql, [email_admin, password_admin], (err, results) => {
               if (err) {
                    console.error("Error al consultar la base de datos:", err);
                    res.status(500).send("Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
               } else {
                    // Verificar si se encontraron resultados en la consulta
                    if (results.length > 0) {
                         // Si las credenciales son válidas, redirigir al usuario a la página de inicio
                         res.redirect("/panel");
                    } else {
                         // Si las credenciales son inválidas, renderizar el formulario de inicio de sesión nuevamente con un mensaje de error
                         res.redirect('/loginAdmin');

                    }
               }
          });
     } else {
          // Si no se proporcionaron el nombre de usuario o la contraseña, renderizar el formulario de inicio de sesión nuevamente con un mensaje de error
          res.render("loginAdmin");
     }
});


router.post('/registroAdmin', async (req, res) => {
     const { nombre_admin, apellido_admin, email_admin, password_admin } = req.body;
     try {
          const existingAdmin = await controllersJs.obtenerAdministradorPorCorreo(email_admin);
          if (existingAdmin) {
               res.render('panel', { error: 'Ya existe un administrador con este correo electrónico' });
          } else {
               await controllersJs.registrarNuevoAdministrador(nombre_admin, apellido_admin, email_admin, password_admin);
               res.redirect('/loginAdmin');
          }
     } catch (error) {
          console.error("Error en el registro de administrador:", error);
          res.status(500).send("Error en el registro de administrador");
     }
});

router.get('/logoutAdmin', (req, res) => {
     req.session.destroy();
     res.redirect('/loginAdmin');
});
export default router;
