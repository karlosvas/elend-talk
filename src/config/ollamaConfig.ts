import { type LogHistory, type ModelCreationParams, type OllamaResponse } from "@/types/types";
import axios, { type AxiosInstance } from "axios";

export class OllamaClient {
  public static instance: OllamaClient;
  private client: AxiosInstance;
  private baseUrl: string = "http://localhost:11434";

  constructor(baseURL: string = "http://localhost:11434") {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static getInstance(): OllamaClient {
    if (!OllamaClient.instance) {
      OllamaClient.instance = new OllamaClient();
    }
    return OllamaClient.instance;
  }

  async createModel(params: ModelCreationParams): Promise<OllamaResponse> {
    try {
      const response = await this.client.post("/api/create", params);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Ollama API Error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  async submitChat(params: { model: string; messages: LogHistory[] }) {
    try {
      console.log("submitChat", params);
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error(`Ollama API error`);
      if (!response.body) throw new Error("Response body is empty");
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Ollama API Error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }
}
export const ollamaClient = OllamaClient.getInstance();

export class ChatHistory {
  private static instance: ChatHistory;
  private readonly messages: LogHistory[] = [];

  private constructor() {
    this.messages = [
      {
        role: "system",
        content:
          'Eres un investigador español experimentado, experto en interpretar y responder preguntas basadas en las fuentes proporcionadas. Utilizando el contexto proporcionado entre las etiquetas <context></context> que viene de los PDFs enviados por el usuario, genera una respuesta concisa para una pregunta rodeada con las etiquetas <question></question>. Debes usar únicamente información del contexto. Usa un tono imparcial y periodístico. No repitas texto. Si no hay nada en el contexto relevante para la pregunta en cuestión, simplemente di "No lo sé". No intentes inventar una respuesta. Cualquier cosa entre los siguientes bloques html context se recupera de un banco de conocimientos, no es parte de la conversación con el usuario.',
      },
    ];
  }

  static getInstance(): ChatHistory {
    if (!ChatHistory.instance) {
      ChatHistory.instance = new ChatHistory();
    }
    return ChatHistory.instance;
  }

  addMessage(role: "system" | "user" | "assistant", content: string): void {
    this.messages.push({ role, content });
  }

  getHistory(): readonly LogHistory[] {
    return [...this.messages];
  }
}
export const chatHistory = ChatHistory.getInstance();
