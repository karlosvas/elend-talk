import { type APIRoute } from "astro";
import { readdir, readFile } from "node:fs/promises";
import { processStream, responseSSE } from "../../utils/utilsSEE.ts";
import { OllamaClient, history } from "../../config/ollamaConfig.ts";
import { type Message } from "@/types/types.ts";
import { MODEL_OLLAMA } from "@/config/constants.ts";

const ollama = new OllamaClient();

// Enpoint para la API de ollama
export const GET: APIRoute = async ({ request }) => {
  // Obtener la pregunta de la URL
  const url = new URL(request.url);
  const question = url.searchParams.get("question");

  if (!question) return new Response("Missing parameters", { status: 400 });

  // Ruta a los .txt que fueron trasnformados por los pdf (disPath)
  // Contexto de todos los pdf (context)
  const dirPath = "public/text";
  let context = "";

  try {
    // Leer todos los archivos dentro de public/text para pasarselo como conexto
    const files: string[] = await readdir(dirPath);
    for (const file of files) {
      const filePath = `${dirPath}/${file}`;
      const fileContent = await readFile(filePath, "utf-8");
      context += fileContent + "\n";
    }
  } catch (error) {
    return new Response("Error reading files", { status: 500 });
  }

  // Respuesta SSE (Server Sent Event)
  return responseSSE({ request }, async (sendEvent) => {
    // Historico de messajes, le añadimos el nuevo
    history.push({
      role: "user",
      content: `<context>${context}</context><question>${question}</question>`,
    });

    // Respuesta de ollama
    let newResponseAssistant: Message = {
      role: "assistant",
      content: "",
    };

    try {
      // Obtenemos la repuesta de la api de ollama
      const response = await ollama.submitChat({ model: MODEL_OLLAMA, messages: history });
      // getReader es un método de Response que devuelbe un ReadableStreamDefaultReader.
      // Este lector permite leer el flujo de datos de la respuesta de manera controlada, chunk por chunk.
      const reader = response.body.getReader();
      await processStream(reader, newResponseAssistant, sendEvent);
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request aborted due to timeout");
      } else {
        console.error("Error sending message to ollama:", error);
      }
    } finally {
      // Añadimos el mensaje recien dado por ollama al historial
      history.push(newResponseAssistant);
      sendEvent("END");
    }
  });
};
