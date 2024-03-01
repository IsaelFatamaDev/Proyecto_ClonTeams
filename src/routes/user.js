import express from "express";
import * as controllersJs from "../controllers/controllers.js";

const server = express.Router();
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


export default server;

