// Importar el módulo 'Router' de Express
import { Router } from "express";
// Importar la función 'ping' del controlador correspondiente
import { ping } from "../controllers/index.js";

// Crear una instancia de Router para definir rutas API
const api = Router();

// Definir una ruta GET "/ping" que utiliza la función 'ping' como controlador
api.get("/ping", ping);

// Exportar el objeto 'api' que contiene las definiciones de ruta
export default api;
