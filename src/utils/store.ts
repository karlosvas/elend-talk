import { type PDFInfoEstatus } from "@/types/types";
import { writable, type Writable } from "svelte/store";

// Constants
export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1,
};

// Store definitions
export const appStatus: Writable<number> = writable(APP_STATUS.INIT);
export const appStatusInfo: PDFInfoEstatus = writable({ id: "", url: "", pages: 0, text: "", images: [] });
export const errorMessage: Writable<string> = writable("");

// Store actions
export const setAppStatusLoading = () => {
  appStatus.set(APP_STATUS.LOADING);
};

export const setAppStatusError = (message: string) => {
  appStatus.set(APP_STATUS.ERROR);
  errorMessage.set(message);
  console.error(message);
};

export const setAppStatusChatMode = () => {
  appStatus.set(APP_STATUS.CHAT_MODE);
};

export const setAppStatusInit = () => {
  appStatus.set(APP_STATUS.INIT);
  errorMessage.set(""); // Limpiamos el mensaje de error
};
