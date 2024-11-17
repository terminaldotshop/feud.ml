console.log("[production] Starting Adam Server...")

import { server } from "../server.jsx"

import * as Bus from "../events.js"

let state = Bus.getState()
state.running = true
state.questions = [
  "This is the first question",
  "This is the second question",
]


// Log server to make sure that the file is required and loaded...
console.log("[production] ... completed setup", server);
