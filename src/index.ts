import { app, BrowserWindow, ipcMain } from "electron"
import * as path from "path"

// Backend
import Database from "./backend/modules/Database"
import AI from "./backend/modules/AI"
import {continueStory, resetStory, startNewStory} from "./backend/story"
import {getSettings, updateSettings} from "./backend/settings"
import {getProfiles} from "./backend/profiles"

// Utils
import env from "./utils/env"

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    autoHideMenuBar: true,
    center: true,
    show: false,
    icon: path.join(__dirname, "./assets/images/logo.ico"),
    focusable: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "./preload.js")
    }
  })

  await win.loadFile(path.join(__dirname, "./screens/menu.html"))

  return win
}

let win: BrowserWindow

app.whenReady().then(async () => {
  win = await createWindow()
  win.show()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Setup Database
  Database.load("./app_data.json")
    .then(() => AI.setToken(env.CHAT_GPT_API_KEY))
    .then(() => {
      Database.createDefaultSettings()
      Database.createProfiles()
    })
})

ipcMain.on("change-screen", async (_, page, params) => {
  const window = BrowserWindow.getFocusedWindow()

  if (window) {
    window.hide()

    const queryParams = params ? `?${params}` : ""
    window.loadFile(path.join(__dirname, `../src/screens/${page}.html${queryParams}`))
      .then(() => window.show())
  }
})

ipcMain.on("quit", async () => app.quit())

ipcMain.handle("new-story", async (_, data) => await startNewStory(data))
ipcMain.handle("continue-story", async (_, data) => await continueStory(data))
ipcMain.handle("reset-story", async (_, data) => await resetStory(data))

ipcMain.handle("get-settings", () => getSettings())
ipcMain.handle("set-settings", (_, data) => updateSettings(data))

ipcMain.handle("get-profiles", () => getProfiles())

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})
