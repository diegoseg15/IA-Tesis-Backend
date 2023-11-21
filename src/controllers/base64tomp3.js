import { promises as fsPromises } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const fs = fsPromises;

// Obtén la ruta del directorio del módulo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// La función para convertir Base64 a archivo de audio y subirlo

export async function base64ToAudioAndUpload(res, base64Data) {
  if (!base64Data) {
    res.status(400).json({ error: "Missing base64Data in the request body" });
    return; // Añade un retorno para salir de la función en caso de error
  }

  // Decodificar base64 a datos binarios
  const binaryData = Buffer.from(base64Data, "base64");

  // Crear un nombre de archivo único
  const fileName = `audio_${Date.now()}.mp3`;

  // Ruta completa del archivo
  const filePath = join(__dirname, "../../uploads", fileName);

  try {
    // Escribir datos binarios en el archivo
    await fs.writeFile(filePath, binaryData, "binary");
    return filePath;
  } catch (err) {
    res.status(500).json({ error: "Error writing the file" });
    throw err; // Lanza el error para que sea manejado en el bloque catch externo
  }
}
