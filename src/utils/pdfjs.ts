import * as pdfjs from "pdfjs-dist";
import { type PDFInfo } from "../types/types";

// Configura el worker de pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = "../../node_modules/pdfjs-dist/build/pdf.worker.mjs";

// Configure worker
export async function extractTextFromPDF(file: File): Promise<PDFInfo> {
  const fileReader = new FileReader();

  // Lee el archivo como un ArrayBuffer
  const fileArrayBuffer: ArrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
    fileReader.onerror = () => reject(fileReader.error);
    fileReader.readAsArrayBuffer(file);
  });

  if (!fileArrayBuffer || fileArrayBuffer.byteLength === 0) throw new Error("Failed to read file");

  // Carga el PDF desde el ArrayBuffer
  const url = URL.createObjectURL(file);
  const id = url.split("/").pop() || "";
  const pdf = await pdfjs.getDocument(fileArrayBuffer).promise;
  let text = "";

  // Itera sobre cada página del PDF
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
  }

  return { id, url, page: pdf.numPages, text };
}

export async function extractTextFromPDFWhitURL(url: string): Promise<PDFInfo> {
  // Cargar el PDF
  const loadingTask = pdfjs.getDocument(url);
  const pdf = await loadingTask.promise;

  // Extraer datos del pdf
  const id = url.split("/").pop() || "";
  let text = "";
  const numPages = pdf.numPages;

  // Iterar sobre cada página
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // Concatenar el texto de cada página
    text += content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
  }

  return { id, url, page: numPages, text };
}
