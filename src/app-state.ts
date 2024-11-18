import { appendFile } from "node:fs/promises"
import * as Bus from "./events.js"
import * as fs from "fs/promises"

function responsed(state: TrackingState): ResponsedTrackingState {
  if (!state.responses) {
    state.responses = []
  }
  return state as ResponsedTrackingState
}

function prompted(state: TrackingState): PromptedTrackingState {
  if (!state.prompt) {
    state.prompt = {
      sent: [],
      prompts: []
    };
  }
  return state as PromptedTrackingState
}

export async function saveState(path: string) {
  await fs.writeFile(path, JSON.stringify(Bus.getState().tracking))
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

export function sendingPrompt(s: AppState, prompt: string, position: number): void {
  const tracking = prompted(s.tracking)
  tracking.prompt.prompts[position] = prompt
  tracking.prompt.sent[position] = true
}

export function createdToDax(s: AppState, dax: ToDax): void {
  s.tracking.toDax = {
    data: dax,
    sent: false,
    failReason: "",
  }
}

export function surveyClosed(s: AppState): void {
  s.tracking.state = "closed"
}

export function surveyOpened(s: AppState): void {
  s.tracking.state = "open"
}

export function cannotSendDax(s: AppState, reason: string): void {
  if (!s.tracking.toDax) {
    s.tracking.toDax = {
      data: null,
      sent: false,
      failReason: reason,
    }
  }
  s.tracking.toDax.failReason = reason
}

export function sentDax(s: AppState): void {
  if (s.tracking.toDax) {
    s.tracking.toDax.sent = true
  }
}

export function responseReceived(s: AppState, response: FromGPT | null, position: number): void {
  const tracking = responsed(s.tracking)
  tracking.responses[position] = response
}

export function questionsReceived(s: AppState, questions: string[]): void {
  s.questions = questions
}

export function reset(s: PartialAppState | AppState): AppState {
  return {
    ...s,
    tracking: {
      messages: {
        twitch: 0,
        audience: 0,
      }
    }
  }
}

let sendId: NodeJS.Timeout | null = null
const messageQueue: string[] = []
export function pushTwitchMessage(msg: string) {
  try {
    messageQueue.push(`twitch: ${msg}`)
  } catch { }
  ensureFlush()
}

export function pushAudienceMessage(msg: string) {
  try {
    messageQueue.push(`audienc: ${msg}`)
  } catch { }
  ensureFlush()
}

function ensureFlush() {
  if (sendId !== null) {
    return
  }
  // @ts-ignore
  sendId = setTimeout(async function() {
    const out = messageQueue.join("\n")
    try {
      await appendFile("./messages.log", out)
    } catch { }
    sendId = null
  }, 2000);
}
