import express from "express";
import * as controllersJs from "../controllers/controllers.js";
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
export default router;
