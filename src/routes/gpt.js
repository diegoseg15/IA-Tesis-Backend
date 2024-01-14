// Importar el módulo 'Router' de Express
import { Router } from "express";
// Importar la función 'gpt' del controlador correspondiente
import { gpt } from "../controllers/gpt.js";

// Crear una instancia de Router para definir rutas API
const api = Router();

// Definir una ruta POST "/gpt/message" que utiliza la función 'gpt' como controlador
api.post("/gpt/message", gpt);

// Exportar el objeto 'api' que contiene las definiciones de ruta
export default api;
