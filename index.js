import express from "express";
import indexRoutes from "./src/routes/index.js";
import GPTRoutes from "./src/routes/gpt.js";
import WhisperRoutes from "./src/routes/whisper.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const app = express();

// Configurar CORS
app.use(cors({ origin: "*" }));

// Configurar análisis de JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurar encabezados HTTP
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Configurar rutas básicas
app.use(`/api/${process.env.API_VERSION}`, indexRoutes);
app.use(`/api/${process.env.API_VERSION}`, GPTRoutes);
app.use(`/api/${process.env.API_VERSION}`, WhisperRoutes);

// Iniciar el servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${process.env.PORT}`);
});
