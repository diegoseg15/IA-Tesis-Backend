// Importar la biblioteca OpenAI para interactuar con la API de OpenAI
import OpenAI from "openai";
// Importar la biblioteca 'dotenv' para cargar variables de entorno desde un archivo '.env'
import dotenv from "dotenv";
// Importar la función 'countSyllables' desde el archivo 'syllableCounter.js'
import { countSyllables } from "./syllableCounter.js";
// Importar la biblioteca 'fs' para manejar operaciones de sistema de archivos
import fs from "fs";

// Configurar las variables de entorno desde el archivo '.env'
dotenv.config({ path: "./.env" });

// Crear una instancia de la clase OpenAI con la clave de API proporcionada en las variables de entorno
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Exportar la función 'gpt' que manejará las solicitudes a la API REST
export const gpt = async (req, res) => {
  try {
    // Obtener el mensaje del cuerpo de la solicitud
    const message = req.body;

    // Realizar una solicitud a la API de OpenAI para completar el chat
    const completion = await openai.chat.completions.create({
      messages: message,
      model: "gpt-3.5-turbo-16k-0613",
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Enviar una respuesta JSON con el texto y la longitud del contenido generado por el modelo
    res.status(200).json({
      text: completion.choices[0].message.content.toString(),
    });
  } catch (error) {
    // Enviar una respuesta de error si ocurre un problema durante la ejecución
    res.status(500).json({ modelo: "Error en modelo GPT", error });
  }
};
