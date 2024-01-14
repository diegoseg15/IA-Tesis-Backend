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
let servoBoca, servoCabeza, servoCuello;

board.on("ready", () => {
  try {
    servoBoca = new five.Servo({ pin: 9, startAt: 135, range: [0, 135] });
    servoCabeza = new five.Servo({ pin: 10, startAt: 150, range: [0, 150] });
    servoCuello = new five.Servo({ pin: 6, startAt: 50, range: [0, 150] });
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
      servoBoca.to(45, tiempoPorPalabra);

      // Calcula el tiempo restante después del movimiento del servo
      const tiempoRestante = Math.max(
        0,
        duracionAudio - (palabras.indexOf(palabra) + 1) * tiempoPorPalabra
      );

      // Calcula la duración del periodo de espera según el tiempo restante
      const duracionEspera = Math.min(tiempoRestante, 235);

      // Espera el tiempo calculado
      await new Promise((resolve) => setTimeout(resolve, duracionEspera));

      // Mueve el servo a la posición 10 durante el tiempo disponible para cada palabra
      servoBoca.to(135, tiempoPorPalabra);

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

const MOVIMIENTO_ARRIBA = "arriba";
const MOVIMIENTO_ABAJO = "abajo";
const MOVIMIENTO_IZQUIERDA = "izquierda";
const MOVIMIENTO_DERECHA = "derecha";
const MOVIMIENTO_INICIAL = "inicio";

app.post(`/api/${process.env.API_VERSION}/cabeza`, async (req, res) => {
  try {
    const instruction = req.body;
    let servo, angle;

    // Verifica si el servo está definido
    if (!servoCabeza && !servoCuello) {
      throw new Error("El servo no está inicializado correctamente.");
    }

    if (
      instruction.movimiento === MOVIMIENTO_ARRIBA ||
      instruction.movimiento === MOVIMIENTO_ABAJO
    ) {
      servoCuello.to(50, 100);
      servo = servoCabeza;
      angle = instruction.movimiento === MOVIMIENTO_ARRIBA ? 0 : 150;
      servo.to(angle, 100);
    } else if (
      instruction.movimiento === MOVIMIENTO_IZQUIERDA ||
      instruction.movimiento === MOVIMIENTO_DERECHA
    ) {
      servo = servoCuello;
      angle = instruction.movimiento === MOVIMIENTO_DERECHA ? 0 : 150;
      servo.to(angle, 100);
    } else if (instruction.movimiento === MOVIMIENTO_INICIAL) {
      servoCuello.to(50, 100);
      servo = servoCabeza.to(50, 100);
    } else {
      throw new Error("Movimiento no válido.");
    }

    res.status(200).send({
      mensaje: `Movimiento de la cabeza hacia ${instruction.movimiento} completado`,
    });
  } catch (err) {
    // Manejo de errores: Envía un mensaje de error al cliente
    res.status(400).send("Error al mover la cabeza: " + err.message);
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
