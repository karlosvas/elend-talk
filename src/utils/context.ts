import fs from "fs";
import path from "path";

export function submitContext(context: string, id: string) {
  try {
    // Añadimos el contexto a public/context.txt
    const contextPath = path.join(__dirname, `/text/${id}.txt`);

    // Nos aseguramos que el directorio exista
    if (!fs.existsSync(contextPath)) {
      fs.mkdirSync(contextPath, { recursive: true });
    }

    // Guardamos el contexto
    fs.writeFileSync(contextPath, context);
  } catch (error) {
    console.error(error);
  }
}
