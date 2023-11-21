import { Router } from "express";
import { gpt } from "../controllers/gpt.js";

const api = Router();

api.post("/gpt/message", gpt);

export default api;
