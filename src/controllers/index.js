// Exportar la función 'ping' para manejar solicitudes de ping en la API REST
export const ping = async (req, res) => {
  // Definir el resultado del ping como el string "Pong"
  const result = "Pong";

  // Enviar una respuesta JSON con el resultado del ping
  res.json(result);
};
