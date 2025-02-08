import { writable } from "svelte/store";

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1,
};

export const appStatus = writable(APP_STATUS.INIT);
export const appStatusInfo = writable({ id: "", url: "", pages: 0 });

export const setAppStatusLoading = () => {
  appStatus.set(APP_STATUS.LOADING);
};
export const setAppStatusError = (p0: string) => {
  appStatus.set(APP_STATUS.ERROR);
};
export const setAppStatusChatMode = ({ id, url, pages }: { id: string; url: string; pages: number }) => {
  appStatus.set(APP_STATUS.CHAT_MODE);
  appStatusInfo.set({ id, url, pages });
};
