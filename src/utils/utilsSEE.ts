import { type UploadApiResponse } from "cloudinary";
import cloudinaryInstance from "../config/cloudinaryConfig";
import { type Message } from "../types/types";

// Server Sent Events
// Función para manejar Server-Sent Events (SSE)
export const responseSSE = (
  { request }: { request: Request },
  callback: (sendEvent: (data: any) => void) => Promise<void>
) => {
  // Crear un nuevo ReadableStream para enviar eventos
  const body = new ReadableStream({
    async start(controller) {
      // Codificador de texto para convertir strings a Uint8Array
      const encoder = new TextEncoder();

      // Función para enviar eventos al cliente
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Ejecutar el callback con la función sendEvent
      callback(sendEvent);

      // Manejar el cierre de la conexión
      request.signal.addEventListener("abort", () => {
        controller.close();
      });
    },
  });

  // Devolver la respuesta con las cabeceras apropiadas para SSE
  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};

// Subida de flujo a Cloudinary, convertir a binario y almacenarlo en un búfer.
export const uploadStream = async (buffer: Uint8Array): Promise<UploadApiResponse | any> => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: "pdf",
      ocr: "adv_ocr",
    };
    // Subir el flujo a Cloudinary
    cloudinaryInstance.uploader
      .upload_stream(options, (error, result) => {
        if (result) return resolve(result);
        reject(error);
      })
      .end(buffer);
  });
};

// Procesar un chunk, obtenido al procesar el texto repsuesta
const processChunk = (chunk: string, newResponseAssistant: Message, sendEvent: (event: any) => void) => {
  try {
    // Vamos almacenando el parse de los chunks como nuesva repuesta y lo enviamos al evento de su servicio
    const data = JSON.parse(chunk);
    newResponseAssistant.content += data.message.content;
    sendEvent(data);
  } catch (parseError) {
    console.error("Error parsing chunk:", parseError);
  }
};

// Procesar los datos de repuesta de ollama
export async function processStream(
  reader: ReadableStreamDefaultReader,
  newResponseAssistant: Message,
  sendEvent: (event: any) => void
): Promise<void> {
  // Creamos el decodificador
  const decoder = new TextDecoder("utf-8");

  // Buffer para almacenar datos parciales hasta encontrar un salto de línea
  let buffer = "";
  // Se ha terminado de revibir repuesta (done)
  let done = false;

  while (!done) {
    // Leemos un chunk de datos del lector
    const result = await reader.read();
    done = result.done;
    const value = result.value;
    if (done) break;

    // Decodificamos el chunk de datos y lo añadimos al buffer
    buffer += decoder.decode(value, { stream: true });
    let boundary = buffer.indexOf("\n");

    // Mientras haya un salto de línea en el buffer
    while (boundary !== -1) {
      const chunk = buffer.slice(0, boundary);
      // Actualizamos el buffer eliminando el chunk procesado
      buffer = buffer.slice(boundary + 1);
      // Procesamos el chunk extraído
      processChunk(chunk, newResponseAssistant, sendEvent);
      // Buscamos el siguiente salto de línea en el buffer
      boundary = buffer.indexOf("\n");
    }
  }
}
