import * as Bus from "./events.js"
import * as fs from "fs/promises"

export async function saveState(path: string) {
  await fs.writeFile(path, JSON.stringify(Bus.getState()))
}

let intervalId: any = null
export function enableSaveInterval(path: string, intervalMS: number) {
  intervalId = setInterval(() => {
    saveState(path);
  }, intervalMS)
}

export function disableSaveInterval() {
  if (intervalId) {
    clearInterval(intervalId)
  }
}

export function trackState() {
  Bus.listen("")
}
