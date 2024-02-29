import express from "express";
import bodyParser from "body-parser";
import path from "path";
import adminRouter from "./src/routes/admin.js";
import morgan from "morgan";
import fetch from "node-fetch";

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const app = express();

// Configurar la API key
const API_KEY = "AIzaSyAoSdT1zxPrR-W3GT4y9yusaQ-RaKKmwJQ";

app.set("view engine", "ejs");
// Crear una instancia de GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(API_KEY);

app.set("views", path.join("views"));
app.use(morgan("dev"));
// Obtener el modelo generativo
const MODEL_NAME = "gemini-1.0-pro";
const model = genAI.getGenerativeModel({ model: MODEL_NAME });
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("public/")));
// Configurar la aplicación para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.use("/", adminRouter);
// Ruta para manejar las solicitudes POST del cliente
app.post('/query', async (req, res) => {
  try {
      const userMessage = req.body.message; // Obtener el mensaje del usuario desde el cuerpo de la solicitud
      const proyectoSeleccionado = req.body.proyectoSeleccionado; // Obtener el proyecto seleccionado

      // Iniciar una conversación con el modelo y enviar el mensaje del usuario
      const chat = model.startChat({
          history: [
              {
                  role: "user",
                  parts: [{ text: userMessage }],
              },
              {
                  role: "model",
                  parts: [{ text: "Hola, ¿cómo puedo ayudarte hoy?" }],
              },
          ],
      });

      // Enviar mensaje al modelo generativo
      const result = await chat.sendMessage("Hola, soy estudiante de vallegrande. Quiero que generes ideas innovadoras y códigos, basándote en este proyecto: " + proyectoSeleccionado + ". Todo el contexto de lo que voy a decir es importante, así que guíate basándote en esto: " + userMessage + ". Al final de responder todo, vas a decir esto: 'Soy Inteligencia Artificial de Valle Grande'.");
      const response = result.response;

      // Enviar la respuesta del modelo al cliente
      res.json({ response: response.text() });

      // Enviar los datos a tu Google Sheet
      const googleSheetUrl = "https://script.google.com/macros/s/AKfycbxFOnT8h2kTsfd9EG6Bu82sykklkpMKxu3eHmPCt66FpNPXcvTNMxdMFYrJZAZ4-uRs/exec";
      const formData = new URLSearchParams(); // Crea un objeto FormData para enviar los datos

      formData.append('message', userMessage); // Agrega el mensaje del usuario
      formData.append('response', response.text()); // Agrega la respuesta del modelo generativo

      // Realiza la solicitud POST a tu Google Sheet
      const googleSheetResponse = await fetch(googleSheetUrl, {
          method: 'POST',
          body: formData
      });

      // Verifica la respuesta de Google Sheet si es necesario
      const googleSheetResponseBody = await googleSheetResponse.text();
      console.log('Respuesta de Google Sheet:', googleSheetResponseBody);

  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});
app.listen(PORT, () => {
     console.log(`Server is running on port http://localhost:${PORT}`);
});
