import express from "express";
import indexRoutes from "./src/routes/index.js";
import GPTRoutes from "./src/routes/gpt.js";
import WhisperRoutes from "./src/routes/whisper.js";
// import MotoresRoutes from "./src/routes/motores.js";
import cors from "cors";
import dotenv from "dotenv";
import five from "johnny-five";

dotenv.config({ path: "./.env" });

const app = express();

// Configurar CORS
app.use(cors({ origin: "*" }));

// Configurar análisis de JSON
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Configurar encabezados HTTP
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Configura la placa Arduino
const board = new five.Board();

// Inicializa los servomotores
let servoBoca;

board.on("ready", () => {
  try {
    servoBoca = new five.Servo({ pin: 6, startAt: 0, range: [0, 45] });
    console.log("Arduino board is ready!");
  } catch (error) {
    console.error("Error al inicializar el servo:", error);
  }
});

board.on("error", (err) => {
  console.log("Error al comunicarse con el arduino:", err);
});

// Ruta para controlar el servo de la boca con sincronización
app.post(`/api/${process.env.API_VERSION}/boca`, async (req, res) => {
  try {
    // Verifica si servoBoca está definido
    if (!servoBoca) {
      throw new Error("El servo no está inicializado correctamente.");
    }

    const { texto, duracionAudio } = req.body;
    const palabras = texto.split(" ");

    // Calcula el tiempo disponible para cada palabra
    const tiempoPorPalabra = duracionAudio / palabras.length;

    // Utiliza un bucle for...of para garantizar la sincronización
    for (const palabra of palabras) {
      // Mueve el servo a la posición 40 durante el tiempo disponible para cada palabra
      console.log("Moviendo servo a la posición 40 para la palabra:", palabra);
      servoBoca.to(45, tiempoPorPalabra);

      // Calcula el tiempo restante después del movimiento del servo
      const tiempoRestante = Math.max(
        0,
        duracionAudio - (palabras.indexOf(palabra) + 1) * tiempoPorPalabra
      );

      // Calcula la duración del periodo de espera según el tiempo restante
      const duracionEspera = Math.min(tiempoRestante, 235);

      // Espera el tiempo calculado
      console.log(`Esperando ${duracionEspera} milisegundos...`);
      await new Promise((resolve) => setTimeout(resolve, duracionEspera));

      // Mueve el servo a la posición 10 durante el tiempo disponible para cada palabra
      console.log("Moviendo servo a la posición 10");
      servoBoca.to(0, tiempoPorPalabra);

      // Calcula el tiempo restante después del segundo movimiento del servo
      const tiempoRestanteDespuesMovimiento = Math.max(
        0,
        duracionAudio - (palabras.indexOf(palabra) + 1) * tiempoPorPalabra * 2
      );

      // Calcula la duración del segundo periodo de espera según el tiempo restante
      const duracionEsperaDespuesMovimiento = Math.min(
        tiempoRestanteDespuesMovimiento,
        235
      );

      // Espera el tiempo calculado después del segundo movimiento del servo
      console.log(
        `Esperando ${duracionEsperaDespuesMovimiento} milisegundos...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, duracionEsperaDespuesMovimiento)
      );
    }

    // Envía la respuesta al cliente cuando todas las operaciones han terminado
    res.status(200).send({ mensaje: "Movimiento de la boca completado" });
  } catch (err) {
    // Manejo de errores: Envía un mensaje de error al cliente
    res.status(400).send("Error al mover la boca: " + err.message);
  }
});

// Configurar rutas básicas
app.use(`/api/${process.env.API_VERSION}`, indexRoutes);
app.use(`/api/${process.env.API_VERSION}`, GPTRoutes);
app.use(`/api/${process.env.API_VERSION}`, WhisperRoutes);
// app.use(`/api/${process.env.API_VERSION}`, MotoresRoutes);

// Iniciar el servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${process.env.PORT}`);
});
