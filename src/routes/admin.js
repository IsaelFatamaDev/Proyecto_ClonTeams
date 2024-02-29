import express from "express";
import { obtenerDatos, obtenerDatosCategoria, obtenerProyectosPorCategoria, obtenerNombreCategoria } from "../controllers/controllers.js";

const router = express.Router();

router.get("/panel", (req, res) => {
     res.render("dashboard/panel", {
          title: "Administracion"
     });
});

router.get('/categorias', (req, res) => {
     obtenerDatosCategoria()
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
     obtenerProyectosPorCategoria(categoria)
          .then(proyectos => {
               obtenerNombreCategoria(categoria)
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



router.get('/estadisticas', (req, res) => {
     res.render("dashboard/estadisticas", {
          title: "Estadisticas"
     })
})

router.get('/usuarios', (req, res) => {
     res.render("dashboard/usuarios", {
          title: "Usuarios"
     })
})

router.get('/registros_bot', (req, res) => {
     res.render("dashboard/registros_bot", {
          title: "Registros Bot"
     })
})
export default router;
