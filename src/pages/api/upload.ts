import { chatHistory } from "@/config/ollamaConfig";
import { type APIRoute } from "astro";
import fs from "node:fs/promises";
import path from "node:path";

export const POST: APIRoute = async ({ request }) => {
  // Leer el cuerpo de la solicitud
  const { id, context } = await request.json();

  // Directorio de salida
  const oputDir = path.join(process.cwd(), "public/text");

  // Verificar si el directorio existe, si no, crearlo
  try {
    await fs.access(oputDir);
  } catch (error) {
    await fs.mkdir(oputDir, { recursive: true });
  }

  // Guardar el archivo en public y añadir el mensaje al historial
  fs.writeFile(`${oputDir}/${id}.txt`, context, "utf-8");
  chatHistory.addMessage("system", `<context>${context}</context>`);

  // Return 204 no content
  return new Response(null, { status: 204 });
};
