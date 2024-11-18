console.log("[production] Starting Production Server...")

import * as fs from "fs"
import * as Track from "../app-state.ts"

import * as Bus from "../events.ts"
import * as LLM from "../llm.js"
import { server } from "../server.tsx"
import { Transform } from "../generated/src/agg.js"

Bus.startDashboardClient()
Bus.startTwitchClient()

const statePath = process.env.STATE_PATH
if (!statePath) {
  throw new Error("you must have STATE_PATH specified in env.  this is so we can track the state of the server")
}
Track.enableSaveInterval(statePath, 1000)

Bus.listen("survey.closed", async (state: AppState) => {
  Track.surveyClosed(state)

  console.log("[production] survey closed", state.running)
  if (!state.running) {
    console.log("  ... But already stopped")
    return
  }

  state.running = false

  const t = Transform.transform(state)
  console.log("[production] transformed", JSON.stringify(t))

  const promptResults = await Promise.allSettled(t.questions.map(async (_, i) => {
    const answers = t.answers[i]
    const proompt = LLM.createProompt(t.questions[i], answers)
    Track.sendingPrompt(state, proompt, i)
    fs.writeFileSync(`./logs/prompt-${i}`, proompt)
    console.log(`[production] Waiting for LLM Response ${i}`)
    const promptObj = await LLM.promptMeDaddy(proompt)
    Track.responseReceived(state, promptObj, i);
    console.log(`[production] Received LLM Response ${i}`)
    fs.writeFileSync(`./logs/response-${i}`, JSON.stringify(promptObj))
    return promptObj
  }));

  console.log("[production] Processing LLM Responses ")
  const msg = LLM.processResponse(promptResults.map((x) => {
    if (x.status === "rejected") {
      return undefined
    }
    return x.value
  }))
  Track.createdToDax(state, msg);
  console.log("[production] Sending Round Answers")
  Bus.emit("round-answers", msg)
})

// Log server to make sure that the file is required and loaded...
console.log("[production] ... completed setup", server);
