console.log("[production] Starting Production Server...")

import * as fs from "fs"

import * as Bus from "../events.js"
import * as LLM from "../llm.js"
import { server } from "../server.jsx"
import { Transform } from "../generated/src/agg.js"

Bus.startDashboardClient()
Bus.startTwitchClient()

Bus.listen("survey.closed", async (state: any) => {
  console.log("[production] survey closed", state.running)
  if (!state.running) {
    console.log("  ... But already stopped")
    return
  }

  state.running = false

  const t = Transform.transform(state)
  const promptResults = await Promise.allSettled(t.questions.map(async (_, i) => {
    const answers = t.answers[i]
    const proompt = LLM.createProompt(t.questions[i], answers)
    fs.writeFileSync(`./logs/prompt-${i}`, proompt)
    console.log(`[production] Waiting for LLM Response ${i}`)
    const promptObj = await LLM.promptMeDaddy(proompt)
    console.log(`[production] Received LLM Response ${i}`)
    fs.writeFileSync(`./logs/response-${i}`, JSON.stringify(promptObj))
    return promptObj
  }));

  console.log("[production] Processing LLM Responses ")
  const msg = LLM.processResponse(promptResults.map((x) => { return x.value }))
  console.log("[production] Sending Round Answers")
  Bus.emit("round-answers", msg)
})


// Log server to make sure that the file is required and loaded...
console.log("[production] ... completed setup", server);
