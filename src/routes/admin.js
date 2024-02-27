import express from "express";
import { obtenerDatos } from "../controllers/controllers.js";

const router = express.Router();

router.get("/", (req, res) => {
     obtenerDatos((err, result) => {
          if (err) {
               console.error("Error al ejecutar la consulta:", err);
               res.send("Error al ejecutar la consulta.");
          } else {
               res.render("index", { data: result });
          }
     });
});

export default router;
