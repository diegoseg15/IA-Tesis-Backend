import { Router } from "express";
import { whisperSpeech, whisperTranscription } from "../controllers/whisper.js";

const api = Router();

api.post("/whisper/transcription", whisperTranscription);
api.post("/whisper/speech", whisperSpeech);

export default api;
