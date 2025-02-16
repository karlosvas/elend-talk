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

export type PDFInfo = Writable<{
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
