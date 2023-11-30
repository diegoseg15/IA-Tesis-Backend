import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { base64ToAudioAndUpload } from "./base64tomp3.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const whisperTranscription = (req, res) => {
  const { base64Audio } = req.body;

  try {
    if (base64Audio) {
      base64ToAudioAndUpload(res, base64Audio)
        .then(async (response) => {
          try {
            const transcription = await openai.audio.transcriptions.create({
              file: fs.createReadStream(response),
              model: "whisper-1",
            });
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
      res.status(400).json({ error: "No se envió un archivo de audio válido" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error interno del servidor al procesar el audio" });
  }
};

export const whisperSpeech = async (req, res) => {
  const { message } = req.body;

  try {
    if (message) {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        response_format: "mp3",
        speed: 1.05,
        input: message,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      const base64Data = buffer.toString("base64");

      res.status(200).json({ base64Data });
    } else {
      res.status(400).json({ error: "No se envio un mensaje" });
    }
  } catch (error) {
    console.error("Error al realizar la solicitud a la API de OpenAI:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
