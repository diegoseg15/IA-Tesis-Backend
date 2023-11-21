import { Router } from "express";
import { ping } from "../controllers/index.js";

const api = Router();

api.get("/ping", ping);

export default api;
