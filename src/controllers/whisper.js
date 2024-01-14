// Importar módulos y configuraciones necesarias
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { base64ToAudioAndUpload } from "./base64tomp3.js";
import dotenv from "dotenv";

// Configurar variables de entorno
dotenv.config({ path: "./.env" });

// Crear instancia de OpenAI con la clave de API proporcionada
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Función para transcribir audio utilizando OpenAI Whisper
export const whisperTranscription = (req, res) => {
  const { base64Audio } = req.body;

  try {
    // Verificar si se proporcionó un archivo de audio en formato base64
    if (base64Audio) {
      // Convertir base64 a archivo de audio y realizar la carga
      base64ToAudioAndUpload(res, base64Audio)
        .then(async (response) => {
          try {
            // Transcribir el audio utilizando el modelo Whisper-1 de OpenAI
            const transcription = await openai.audio.transcriptions.create({
              file: fs.createReadStream(response),
              model: "whisper-1",
            });

            // Enviar la transcripción como respuesta
            res.status(200).json(transcription);
          } catch (transcriptionErr) {
            console.error(transcriptionErr);
            res.status(500).json({ error: "Error al transcribir el audio" });
          }
        })
        .catch((uploadErr) => {
          console.error(uploadErr);
          res
            .status(400)
            .json({ error: "Error al procesar el archivo de audio" });
        });
    } else {
      // Responder con un error si no se envió un archivo de audio válido
      res.status(400).json({ error: "No se envió un archivo de audio válido" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error interno del servidor al procesar el audio" });
  }
};

// Función para generar discurso a partir de un mensaje utilizando OpenAI TTS
export const whisperSpeech = async (req, res) => {
  const { message } = req.body;

  try {
    // Verificar si se proporcionó un mensaje
    if (message) {
      // Generar discurso utilizando el modelo TTS-1 de OpenAI
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        response_format: "mp3",
        speed: 1.05,
        input: message,
      });

      // Convertir el resultado a base64 para su envío como respuesta
      const buffer = Buffer.from(await mp3.arrayBuffer());
      const base64Data = buffer.toString("base64");

      // Enviar la respuesta con el discurso en formato base64
      res.status(200).json({ base64Data });
    } else {
      // Responder con un error si no se envió un mensaje
      res.status(400).json({ error: "No se envió un mensaje" });
    }
  } catch (error) {
    console.error("Error al realizar la solicitud a la API de OpenAI:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
