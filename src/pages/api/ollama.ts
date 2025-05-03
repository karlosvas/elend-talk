import { type APIRoute } from "astro";
import { processStream, responseSSE } from "@/utils/utilsSEE.ts";
import { chatHistory, ollamaClient } from "@/config/ollamaConfig.ts";
import { type Message } from "@/types/types.ts";
import { MODEL_OLLAMA } from "@/config/constants.ts";

// Enpoint para la API de ollama
export const GET: APIRoute = async ({ request }) => {
  // Obtener la pregunta de la URL
  const url = new URL(request.url);
  const question = url.searchParams.get("question");

  if (!question) return new Response("Missing parameters", { status: 400 });

  // Respuesta SSE (Server Sent Event)
  return responseSSE({ request }, async (sendEvent) => {
    // Historico de messajes, le añadimos el nuevo
    chatHistory.addMessage("user", `<question>${question}</question>`);

    // Respuesta de ollama
    let newResponseAssistant: Message = {
      role: "assistant",
      content: "",
    };

    // Historico de mensajes
    try {
      // Obtenemos la repuesta de la api de ollama
      const response = await ollamaClient.submitChat({ model: MODEL_OLLAMA, messages: [...chatHistory.getHistory()] });
      // getReader es un método de Response que devuelbe un ReadableStreamDefaultReader.
      // Este lector permite leer el flujo de datos de la respuesta de manera controlada, chunk por chunk.
      if (!response.body) throw new Error("Response body is null");
      const reader = response.body.getReader();
      await processStream(reader, newResponseAssistant, sendEvent);
    } catch (error) {
      // Si el error es de tipo AbortError, significa que el evento fue abortado por un timeout
      if (error instanceof Error && error.name === "AbortError") console.error("Request aborted due to timeout");
      else console.error("Error sending message to ollama:", error);

      sendEvent("ERROR");
    } finally {
      // Añadimos el mensaje recien dado por ollama al historial
      chatHistory.addMessage(newResponseAssistant.role, newResponseAssistant.content);
      sendEvent("END");
    }
  });
};
