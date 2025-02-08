import type { APIRoute } from "astro";
import fs from "node:fs/promises";
import path from "node:path";
import { uploadStream } from "../utils/utils";
import type { UploadApiResponse } from "cloudinary";

export const POST: APIRoute = async ({ request }) => {
  // Obtener el archivo del formulario
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (file === null) {
    return new Response("No file found", { status: 400 });
  }

  // Convierte el archivo en un array buffer
  const arrayBuffer = await file.arrayBuffer();
  const unit8Array = new Uint8Array(arrayBuffer);

  // Subir el archivo a Cloudinary
  let result: UploadApiResponse = {} as UploadApiResponse;
  try {
    result = await uploadStream(unit8Array);
  } catch (error) {
    return new Response("Error uploading file", { status: 500 });
  }

  // Extraer los datos necesarios
  const { asset_id: id, secure_url: url, pages, info } = result;
  // Extraer el texto del archivo
  const data = info?.ocr?.adv_ocr?.data;
  const text = data
    .map((blocks: { textAnnotations: { description: string }[] }) => {
      const annotations = blocks["textAnnotations"] ?? {};
      const first = annotations[0] ?? {};
      const content = first["description"] ?? "";
      return content.trim();
    })
    .filter(Boolean)
    .join("\n");

  // Directorio de salida
  const oputDir = path.join(process.cwd(), "public/text");

  // Verificar si el directorio existe, si no, crearlo
  try {
    await fs.access(oputDir);
  } catch (error) {
    await fs.mkdir(oputDir, { recursive: true });
  }
  // Save the text to a file
  fs.writeFile(`${oputDir}/${id}.txt`, text, "utf-8");

  // Simulate delay 3 sec.
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return new Response(
    JSON.stringify({
      id,
      url,
      pages,
    })
  );
};
