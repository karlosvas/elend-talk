import { type APIRoute } from "astro";
import { readdir, readFile } from "node:fs/promises";
import { responseSSE } from "../utils/utils.ts";
import ollama from "ollama";

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
    const files = await readdir(dirPath);
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

    const response = await ollama.chat({
      model: "llama2",
      messages: [message[0]],
      stream: true,
    });

    for await (const part of response) {
      console.log(part.message.content);
      sendEvent(process.stdout.write(part.message.content));
    }

    sendEvent("END");
  });
};
