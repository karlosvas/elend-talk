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
    const message = [
      {
        role: "user",
        content: `<context>${combinedText}</context><question>${question}</question>`,
      },
    ];

    console.log(message[0]);
    try {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2",
          messages: [message[0]],
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      console.log(response);
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      console.log("Connected to ollama");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        console.log("Buffer:", buffer);

        let boundary = buffer.indexOf("\n");
        while (boundary !== -1) {
          const chunk = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 1);

          console.log("Chunk received:", chunk);

          try {
            console.log("Parsed data:", chunk);
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
