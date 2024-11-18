# Backend IA Node JS

Este proyecto incluye un servidor Express que actúa como intermediario entre la aplicación React y las API de OpenAI. A continuación, se presenta una descripción de los archivos relacionados con el servidor y las rutas de la API.

## Archivo `server.js`

El archivo `server.js` contiene la configuración del servidor Express, la configuración CORS, los encabezados HTTP y las rutas para las funcionalidades principales.

- **Rutas Principales:**
  - `indexRoutes`: Rutas básicas del servidor.
  - `GPTRoutes`: Rutas relacionadas con las interacciones GPT.
  - `WhisperRoutes`: Rutas relacionadas con las interacciones de Whisper.

- **Inicio del Servidor:**
  - Se inicia el servidor en el puerto especificado en el archivo de configuración `.env`.

## Archivo `base64tomp3.js`

Este archivo proporciona una función para convertir datos en formato Base64 a un archivo de audio (MP3) y cargarlo en el servidor.

- **Función:**
  - `base64ToAudioAndUpload`: Convierte datos en formato Base64 a un archivo de audio MP3 y lo guarda en la carpeta de uploads. Devuelve la ruta completa del archivo.

## Archivo `gpt.js`

Este archivo contiene la función `gpt` que realiza una solicitud a la API de OpenAI para generar respuestas utilizando el modelo GPT-3.5 Turbo.

- **Función:**
  - `gpt`: Genera respuestas inteligentes utilizando el modelo GPT-3.5 Turbo. Devuelve información sobre el texto generado, como la cantidad de palabras y la longitud.

## Archivo `whisper.js`

Este archivo contiene las funciones relacionadas con las interacciones de Whisper: transcripción de audio (`whisperTranscription`) y generación de discurso (`whisperSpeech`).

- **Funciones:**
  - `whisperTranscription`: Transcribe audio utilizando la API de Whisper y devuelve el resultado de la transcripción.
  - `whisperSpeech`: Genera discurso a partir de un mensaje utilizando la API de Whisper y devuelve el audio en formato Base64.

**Nota:** Asegúrate de configurar correctamente las variables de entorno en el archivo `.env` con las claves de API necesarias para OpenAI.

Este servidor actúa como puente entre la aplicación React y los servicios de OpenAI, permitiendo la comunicación y la ejecución de las funcionalidades específicas del asistente DORIS.

## Licencia

Este proyecto es propiedad de **Diego Fernando Segovia Escobar** y la **Pontificia Universidad Católica del Ecuador Sede Ambato (PUCE Ambato)**.  
Forma parte de la tesis de grado desarrollada para la obtención del título de grado en la PUCE Ambato.

Todos los derechos reservados. No se permite la reproducción, distribución, ni modificación total o parcial sin el consentimiento explícito de los propietarios.
