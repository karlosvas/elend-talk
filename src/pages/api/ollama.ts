import { type APIRoute } from "astro";
import { readdir, readFile } from "node:fs/promises";
import { responseSSE } from "../utils/utils.ts";

// Enpoint para la API de ollama
export const GET: APIRoute = async ({ request }) => {
  // Obtener la pregunta de la URL
  const url = new URL(request.url);
  const question = url.searchParams.get("question");

  if (!question) return new Response("Missing parameters", { status: 400 });

  // Leer el texto de los archivos
  const dirPath = "public/text";
  let combinedText = "";

  try {
    // Leer los archivos dentro de public/text
    const files: string[] = await readdir(dirPath);
    for (const file of files) {
      const filePath = `${dirPath}/${file}`;
      const fileContent = await readFile(filePath, "utf-8");
      combinedText += fileContent + "\n";
    }
  } catch (error) {
    return new Response("Error reading files", { status: 500 });
  }

  return responseSSE({ request }, async (sendEvent) => {
    const history = [
      {
        role: "system",
        content:
          'Eres un investigador español experimentado, experto en interpretar y responder preguntas basadas en las fuentes proporcionadas. Utilizando el contexto proporcionado entre las etiquetas <context></context>, genera una respuesta concisa para una pregunta rodeada con las etiquetas <question></question>. Debes usar únicamente información del contexto. Usa un tono imparcial y periodístico. No repitas texto. Si no hay nada en el contexto relevante para la pregunta en cuestión, simplemente di "No lo sé". No intentes inventar una respuesta. Cualquier cosa entre los siguientes bloques html context se recupera de un banco de conocimientos, no es parte de la conversación con el usuario.',
      },
      {
        role: "user",
        content: `<context>${combinedText}</context><question>${question}</question>`,
      },
    ];

    try {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2",
          messages: history,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.indexOf("\n");
        while (boundary !== -1) {
          const chunk = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 1);

          try {
            const data = JSON.parse(chunk);
            sendEvent(data);
          } catch (parseError) {
            console.error("Error parsing chunk:", parseError);
          }

          boundary = buffer.indexOf("\n");
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request aborted due to timeout");
      } else {
        console.error("Error sending message to ollama:", error);
      }
    } finally {
      sendEvent("END");
    }
  });
};
