import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

// Configura el worker de pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";

// Configure worker
export async function extractTextFromPDF(file: File): Promise<string> {
  const fileReader = new FileReader();

  // Lee el archivo como un ArrayBuffer
  const fileArrayBuffer: ArrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
    fileReader.onerror = () => reject(fileReader.error);
    fileReader.readAsArrayBuffer(file);
  });

  if (!fileArrayBuffer || fileArrayBuffer.byteLength === 0) throw new Error("Failed to read file");

  // Carga el PDF desde el ArrayBuffer
  const pdf = await pdfjs.getDocument(fileArrayBuffer).promise;
  let text = "";

  // Itera sobre cada página del PDF
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
  }

  return text;
}

export async function extractTextFromPDFWhitURL(url: string): Promise<string> {
  // Cargar el PDF
  const loadingTask = pdfjs.getDocument(url);
  const pdf = await loadingTask.promise;

  let text = "";

  // Iterar sobre cada página
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // Concatenar el texto de cada página
    text += content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
  }

  return text;
}
