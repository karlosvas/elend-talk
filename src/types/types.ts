import { type Writable } from "svelte/store";

export interface SubmitOllamaParams {
  event: Event & {
    target: {
      question: {
        value: string;
      };
    };
  };
  loading: Writable<{ value: boolean }>;
  answer: Writable<{ value: string }>;
  model: OllamaModel;
}

export interface ModelCreationParams {
  name: string;
  modelfile: string;
}

export interface OllamaResponse {
  status: string;
  error?: string;
}

export interface OllamaConfig {
  baseURL: string;
  timeout?: number;
}

export type LogHistory = {
  role: "assistant" | "user" | "system";
  content: string;
};

export interface Message {
  role: "assistant" | "user" | "system";
  content: string;
  images?: null | string[];
}

export interface OllamaResponseChat {
  model: string;
  created_at: string;
  message: Message;
  done: boolean;
}

export interface OllamaCompletionResponse {
  model: string;
  created_at: string;
  done: boolean;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export type PDFInfo = {
  id: string;
  url: string;
  pages: number;
  text: string;
  images: string[];
};

export type PDFInfoEstatus = Writable<{
  id: string;
  url: string;
  pages: number;
  text: string;
  images: string[];
}>;

type File = {
  path: string;
  name: string;
  lastModified: number;
  lastModifiedDate: Date;
  webkitRelativePath: string;
  size: number;
  type: string;
};

export type Files = {
  accepted: File[];
  rejected: File[];
};

export enum OllamaModel {
  Llama3 = "llama3",
  Llama3_2 = "llama3.2",
  DeepSeek = "deepseek-r1",
}

// Función para convertir string a OllamaModel
export function stringToOllamaModel(modelString: string): OllamaModel | null {
  switch (modelString) {
    case "llama3":
      return OllamaModel.Llama3;
    case "llama3.2":
      return OllamaModel.Llama3_2;
    case "deepseek-r1":
      return OllamaModel.DeepSeek;
    default:
      return null; // Retorna null si no encuentra el modelo
  }
}

// Función alternativa más robusta con validación
export function getOllamaModelFromString(modelString: string): OllamaModel {
  const model = stringToOllamaModel(modelString);
  if (!model) {
    throw new Error(`Invalid model: ${modelString}`);
  }
  return model;
}
