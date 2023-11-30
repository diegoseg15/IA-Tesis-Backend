import OpenAI from "openai";
import { realizarMovimiento, setServos } from "../../index.js"; // Importa la función desde el archivo principal

let servoBoca, servoCabeza, servoCuello; // Asegúrate de declarar estas variables aquí
const duracionesSilabas = [100, 150, 120, 200]; // Declaración de duraciones

export const boca = async (req, res) => {
  try {
    const { texto, duracionPausa } = req.body;

    if (!texto) {
      return res.status(400).json({ error: "El texto no puede estar vacío." });
    }

    for (let i = 0; i < texto.length; i++) {
      const sílaba = texto[i].toLowerCase();

      if (
        sílaba === "." ||
        sílaba === "," ||
        sílaba === ";" ||
        sílaba === ":"
      ) {
        // Pausa más larga para signos de puntuación
        await realizarMovimiento(servoBoca, 0, duracionPausa || 1000); // Duración por defecto de 1000 milisegundos
      } else {
        // Duración para sílaba normal
        const duración = duracionesSilabas[i % duracionesSilabas.length];
        await realizarMovimiento(servoBoca, 45, duración);
      }
    }

    res.status(200).json("Movimientos de la boca ejecutados correctamente.");
  } catch (error) {
    res.status(500).json({
      error: "Error en el controlador de boca",
      detalle: error.message,
    });
  }
};

export const cabeza = async (req, res) => {
  try {
    const { angulo, repeticiones } = req.body;

    if (repeticiones <= 0) {
      return res
        .status(400)
        .json({ error: "La cantidad de repeticiones debe ser mayor a 0." });
    }

    for (let i = 0; i < repeticiones; i++) {
      await realizarMovimiento(servoCabeza, angulo, 500); // Duración por defecto de 500 milisegundos
    }

    res.status(200).json("Movimientos de la cabeza ejecutados correctamente.");
  } catch (error) {
    res.status(500).json({
      error: "Error en el controlador de cabeza",
      detalle: error.message,
    });
  }
};

export const cuello = async (req, res) => {
  try {
    const { angulo, repeticiones } = req.body;

    if (repeticiones <= 0) {
      return res
        .status(400)
        .json({ error: "La cantidad de repeticiones debe ser mayor a 0." });
    }

    for (let i = 0; i < repeticiones; i++) {
      await realizarMovimiento(servoCuello, angulo, 500); // Duración por defecto de 500 milisegundos
    }

    res.status(200).json("Movimientos del cuello ejecutados correctamente.");
  } catch (error) {
    res.status(500).json({
      error: "Error en el controlador de cuello",
      detalle: error.message,
    });
  }
};
