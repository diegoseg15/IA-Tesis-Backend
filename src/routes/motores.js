import { Router } from "express";
import { boca, cabeza, cuello } from "../controllers/motrores.js";

const api = Router();

api.post("/boca", boca);
api.post("/cabeza", cabeza);
api.post("/cuello", cuello);

export default api;
