import { contextBridge, ipcRenderer } from "electron"

declare global {
  interface Window {
    API: {
      invoke: (eventName: string, data ?: any) => Promise<any>
      send: (eventName: string, data ?: any) => void
    }
  }
}

const API = {
  async invoke (eventName: string, data: any) {
    return await ipcRenderer.invoke(eventName, data)
  },

  send(eventName: string, data: any) {
    ipcRenderer.send(eventName, data)
  }
}

contextBridge.exposeInMainWorld("API", API)
